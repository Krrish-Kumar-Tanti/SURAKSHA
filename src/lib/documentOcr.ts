export interface ExtractedDocumentFields {
  amount: string | null;
  instrumentNumber: string | null;
  issueDate: string | null;
  maturityDate: string | null;
  bankName: string | null;
  branch: string | null;
  ifsc: string | null;
  depositor: string | null;
  lien: string | null;
}

export interface DocumentTextResult {
  text: string;
  method: 'OCR' | 'PDF text layer' | 'PDF text layer + OCR';
}

type ProgressCallback = (progress: number) => void;

interface ProgressRange {
  start: number;
  span: number;
}

interface RecognitionResult {
  text: string;
  confidence: number;
}

function makeImageVariants(source: HTMLCanvasElement): Promise<HTMLCanvasElement[]> {
  return new Promise((resolve, reject) => {
    const processImage = (image: CanvasImageSource, width: number, height: number) => {
      const maxDimension = Math.max(width, height);
      const scale = Math.min(2, 2800 / maxDimension, Math.max(1, 1800 / maxDimension));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(width * scale));
      canvas.height = Math.max(1, Math.round(height * scale));
      const context = canvas.getContext('2d', { willReadFrequently: true });
      if (!context) {
        reject(new Error('Could not prepare this image for OCR.'));
        return;
      }

      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = 'high';
      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      try {
        const { data, width: imageWidth, height: imageHeight } = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height,
        );
        const histogram = new Uint32Array(256);
        const gray = new Uint8Array(imageWidth * imageHeight);

        for (let pixel = 0, index = 0; pixel < data.length; pixel += 4, index += 1) {
          const value = Math.round(
            data[pixel] * 0.299 + data[pixel + 1] * 0.587 + data[pixel + 2] * 0.114,
          );
          gray[index] = value;
          histogram[value] += 1;
        }

        const pixelCount = gray.length;
        const percentile = (fraction: number) => {
          const target = pixelCount * fraction;
          let count = 0;
          for (let value = 0; value < histogram.length; value += 1) {
            count += histogram[value];
            if (count >= target) return value;
          }
          return 255;
        };
        const blackPoint = percentile(0.02);
        const whitePoint = Math.max(blackPoint + 1, percentile(0.98));
        const range = whitePoint - blackPoint;
        const enhanced = new Uint8Array(pixelCount);
        const enhancedCanvas = document.createElement('canvas');
        enhancedCanvas.width = imageWidth;
        enhancedCanvas.height = imageHeight;
        const enhancedContext = enhancedCanvas.getContext('2d');
        if (!enhancedContext) {
          reject(new Error('Could not enhance this image for OCR.'));
          return;
        }

        const enhancedData = enhancedContext.createImageData(imageWidth, imageHeight);
        for (let index = 0; index < pixelCount; index += 1) {
          const normalized = Math.min(255, Math.max(0, ((gray[index] - blackPoint) * 255) / range));
          // Lift dark phone photos while keeping normal receipts close to their original contrast.
          const corrected = Math.round(255 * Math.pow(normalized / 255, 0.82));
          enhanced[index] = corrected;
          const pixel = index * 4;
          enhancedData.data[pixel] = corrected;
          enhancedData.data[pixel + 1] = corrected;
          enhancedData.data[pixel + 2] = corrected;
          enhancedData.data[pixel + 3] = 255;
        }
        enhancedContext.putImageData(enhancedData, 0, 0);

        const enhancedHistogram = new Uint32Array(256);
        let totalIntensity = 0;
        for (const value of enhanced) {
          enhancedHistogram[value] += 1;
          totalIntensity += value;
        }
        let backgroundWeight = 0;
        let backgroundIntensity = 0;
        let threshold = 127;
        let maximumVariance = 0;
        for (let value = 0; value < enhancedHistogram.length; value += 1) {
          backgroundWeight += enhancedHistogram[value];
          if (backgroundWeight === 0) continue;
          const foregroundWeight = pixelCount - backgroundWeight;
          if (foregroundWeight === 0) break;
          backgroundIntensity += value * enhancedHistogram[value];
          const backgroundMean = backgroundIntensity / backgroundWeight;
          const foregroundMean = (totalIntensity - backgroundIntensity) / foregroundWeight;
          const variance = backgroundWeight * foregroundWeight
            * (backgroundMean - foregroundMean) ** 2;
          if (variance > maximumVariance) {
            maximumVariance = variance;
            threshold = value;
          }
        }
        const otsuCanvas = document.createElement('canvas');
        otsuCanvas.width = imageWidth;
        otsuCanvas.height = imageHeight;
        const otsuContext = otsuCanvas.getContext('2d');
        if (!otsuContext) {
          reject(new Error('Could not build a high-contrast image for OCR.'));
          return;
        }
        const otsuData = otsuContext.createImageData(imageWidth, imageHeight);
        for (let index = 0; index < pixelCount; index += 1) {
          const value = enhanced[index] <= threshold ? 0 : 255;
          const pixel = index * 4;
          otsuData.data[pixel] = value;
          otsuData.data[pixel + 1] = value;
          otsuData.data[pixel + 2] = value;
          otsuData.data[pixel + 3] = 255;
        }
        otsuContext.putImageData(otsuData, 0, 0);

        const integral = new Float64Array((imageWidth + 1) * (imageHeight + 1));
        const integralWidth = imageWidth + 1;
        for (let y = 1; y <= imageHeight; y += 1) {
          let rowSum = 0;
          for (let x = 1; x <= imageWidth; x += 1) {
            rowSum += enhanced[(y - 1) * imageWidth + x - 1];
            integral[y * integralWidth + x] = integral[(y - 1) * integralWidth + x] + rowSum;
          }
        }

        const adaptiveCanvas = document.createElement('canvas');
        adaptiveCanvas.width = imageWidth;
        adaptiveCanvas.height = imageHeight;
        const adaptiveContext = adaptiveCanvas.getContext('2d');
        if (!adaptiveContext) {
          reject(new Error('Could not build a shadow-corrected image for OCR.'));
          return;
        }
        const adaptiveData = adaptiveContext.createImageData(imageWidth, imageHeight);
        const radius = Math.max(16, Math.round(Math.min(imageWidth, imageHeight) * 0.035));
        for (let y = 0; y < imageHeight; y += 1) {
          const top = Math.max(0, y - radius);
          const bottom = Math.min(imageHeight, y + radius + 1);
          for (let x = 0; x < imageWidth; x += 1) {
            const left = Math.max(0, x - radius);
            const right = Math.min(imageWidth, x + radius + 1);
            const area = (bottom - top) * (right - left);
            const sum = integral[bottom * integralWidth + right]
              - integral[top * integralWidth + right]
              - integral[bottom * integralWidth + left]
              + integral[top * integralWidth + left];
            const threshold = sum / area - 9;
            const value = enhanced[y * imageWidth + x] < threshold ? 0 : 255;
            const pixel = (y * imageWidth + x) * 4;
            adaptiveData.data[pixel] = value;
            adaptiveData.data[pixel + 1] = value;
            adaptiveData.data[pixel + 2] = value;
            adaptiveData.data[pixel + 3] = 255;
          }
        }
        adaptiveContext.putImageData(adaptiveData, 0, 0);
        resolve([canvas, enhancedCanvas, otsuCanvas, adaptiveCanvas]);
      } catch {
        reject(new Error('This image could not be processed. Try a clearer image or PDF.'));
      }
    };

    processImage(source, source.width, source.height);
  });
}

async function recognizeImage(
  worker: Awaited<ReturnType<typeof import('tesseract.js').createWorker>>,
  image: HTMLCanvasElement,
  onProgress: ProgressCallback,
  progressRange: ProgressRange,
  progressStart: number,
  progressSpan: number,
  pageSegmentationMode: import('tesseract.js').PSM,
): Promise<RecognitionResult> {
  progressRange.start = progressStart;
  progressRange.span = progressSpan;
  let reportedProgress = progressStart;
  const reportProgress = (value: number) => {
    reportedProgress = Math.max(reportedProgress, Math.min(100, value));
    onProgress(reportedProgress);
  };
  await worker.setParameters({
    tessedit_pageseg_mode: pageSegmentationMode,
  });
  const result = await worker.recognize(image, { rotateAuto: true }, {
    blocks: false,
    hocr: false,
    tsv: false,
    text: true,
  });
  reportProgress(progressStart + progressSpan);
  return { text: result.data.text, confidence: result.data.confidence };
}

function scoreRecognition(result: RecognitionResult): number {
  const fields = extractDocumentFields(result.text);
  const extractedFieldCount = Object.values(fields).filter(Boolean).length;
  const usefulTextLength = result.text.replace(/\s/g, '').length;
  return extractedFieldCount * 100 + Math.min(usefulTextLength, 200) * 0.1 + result.confidence * 0.05;
}

async function recognizeWithEnhancements(
  worker: Awaited<ReturnType<typeof import('tesseract.js').createWorker>>,
  image: HTMLCanvasElement,
  onProgress: ProgressCallback,
  progressRange: ProgressRange,
  progressStart: number,
  progressSpan: number,
): Promise<string> {
  const variants = await makeImageVariants(image);
  let bestResult: RecognitionResult = { text: '', confidence: 0 };
  let bestScore = -1;
  const { PSM } = await import('tesseract.js');
  const pageSegmentationModes = [PSM.AUTO, PSM.SINGLE_BLOCK, PSM.SPARSE_TEXT];
  const attemptCount = variants.length * pageSegmentationModes.length;
  let attempt = 0;

  for (const variant of variants) {
    for (const pageSegmentationMode of pageSegmentationModes) {
      const result = await recognizeImage(
        worker,
        variant,
        onProgress,
        progressRange,
        progressStart + (progressSpan * attempt) / attemptCount,
        progressSpan / attemptCount,
        pageSegmentationMode,
      );
      attempt += 1;
      const score = scoreRecognition(result);
      if (score > bestScore) {
        bestResult = result;
        bestScore = score;
      }
      if (Object.values(extractDocumentFields(result.text)).filter(Boolean).length >= 5) {
        onProgress(Math.min(100, progressStart + progressSpan));
        return result.text;
      }
    }
  }

  onProgress(Math.min(100, progressStart + progressSpan));
  return bestResult.text;
}

export async function readDocumentText(
  file: File,
  onProgress: ProgressCallback,
): Promise<DocumentTextResult> {
  const progressRange = { start: 0, span: 100 };
  let reportedProgress = 0;
  const reportProgress = (value: number) => {
    reportedProgress = Math.max(reportedProgress, Math.min(100, value));
    onProgress(reportedProgress);
  };
  const workerState: {
    current?: Awaited<ReturnType<typeof import('tesseract.js').createWorker>>;
  } = {};
  const getWorker = async () => {
    if (!workerState.current) {
      const { createWorker } = await import('tesseract.js');
      workerState.current = await createWorker('eng', 1, {
        logger: ({ status, progress }) => {
          if (status === 'recognizing text' && Number.isFinite(progress)) {
            reportProgress(Math.round(progressRange.start + progress * progressRange.span));
          }
        },
      });
    }
    return workerState.current;
  };

  try {
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      const bitmap = await createImageBitmap(file);
      const source = document.createElement('canvas');
      source.width = bitmap.width;
      source.height = bitmap.height;
      const sourceContext = source.getContext('2d');
      if (!sourceContext) {
        bitmap.close();
        throw new Error('Could not prepare this image for OCR.');
      }
      sourceContext.drawImage(bitmap, 0, 0);
      bitmap.close();
      const text = await recognizeWithEnhancements(
        await getWorker(),
        source,
        reportProgress,
        progressRange,
        0,
        100,
      );
      return { text, method: 'OCR' };
    }

    const [{ getDocument, GlobalWorkerOptions }, { default: pdfWorkerUrl }] = await Promise.all([
      import('pdfjs-dist'),
      import('pdfjs-dist/build/pdf.worker.min.mjs?url'),
    ]);
    GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
    const loadingTask = getDocument({ data: await file.arrayBuffer() });
    const pdf = await loadingTask.promise;
    const pageTexts: string[] = [];
    let usedOcr = false;
    let usedTextLayer = false;

    try {
      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
        const page = await pdf.getPage(pageNumber);
        const content = await page.getTextContent();
        const pageText = content.items
          .map((item) => (
            'str' in item
              ? `${item.str}${item.hasEOL ? '\n' : ' '}`
              : ''
          ))
          .join('')
          .trim();

        if (pageText.length > 15) {
          pageTexts.push(pageText);
          usedTextLayer = true;
          reportProgress(Math.round((pageNumber / pdf.numPages) * 100));
          page.cleanup();
          continue;
        }

        usedOcr = true;
        const viewport = page.getViewport({ scale: 3 });
        const canvas = document.createElement('canvas');
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        const context = canvas.getContext('2d');
        if (!context) {
          throw new Error('Could not prepare this PDF page for OCR.');
        }

        await page.render({ canvas, canvasContext: context, viewport }).promise;
        const pageProgressStart = Math.round(((pageNumber - 1) / pdf.numPages) * 100);
        const pageProgressSpan = 100 / pdf.numPages;
        pageTexts.push(
          await recognizeWithEnhancements(
            await getWorker(),
            canvas,
            reportProgress,
            progressRange,
            pageProgressStart,
            pageProgressSpan,
          ),
        );
        page.cleanup();
      }
    } finally {
      await loadingTask.destroy();
    }

    return {
      text: pageTexts.join('\n'),
      method: usedOcr
        ? usedTextLayer
          ? 'PDF text layer + OCR'
          : 'OCR'
        : 'PDF text layer',
    };
  } finally {
    if (workerState.current) await workerState.current.terminate();
  }
}

function findLabeledValue(text: string, label: RegExp): string | null {
  const line = text.split(/\r?\n/).find((candidate) => label.test(candidate));
  if (!line) return null;

  const value = line.replace(label, '').replace(/^[\s:#-]+/, '').trim();
  return value || null;
}

function parseDate(value: string | null): string | null {
  if (!value) return null;
  const match = value.match(/\b(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})\b|\b(\d{4})[./-](\d{1,2})[./-](\d{1,2})\b/);
  if (!match) return null;

  if (match[4]) {
    return `${match[4]}-${match[5].padStart(2, '0')}-${match[6].padStart(2, '0')}`;
  }

  const year = match[3].length === 2 ? `20${match[3]}` : match[3];
  return `${year}-${match[2].padStart(2, '0')}-${match[1].padStart(2, '0')}`;
}

export function extractDocumentFields(text: string): ExtractedDocumentFields {
  const normalizedText = text.replace(/\u00a0/g, ' ');
  const amountLabel = /\b(?:amount|principal|face value|sum)\b/i;
  const amountPattern = /(?:INR|Rs\.?|₹)?\s*([\d][\d,]*(?:\.\d{1,2})?)/i;
  const labeledAmount = normalizedText.split(/\r?\n/).flatMap((line) => {
    const labelMatch = amountLabel.exec(line);
    if (!labelMatch) return [];
    const valueMatch = amountPattern.exec(
      line.slice(labelMatch.index + labelMatch[0].length),
    );
    return valueMatch ? [valueMatch] : [];
  })[0];
  const amountMatch = labeledAmount ?? normalizedText.match(/(?:INR|Rs\.?|₹)\s*([\d][\d,]*(?:\.\d{1,2})?)/i);
  const amount = amountMatch ? amountMatch[1].replace(/,/g, '') : null;
  const instrumentNumber = findLabeledValue(
    normalizedText,
    /^(?:FDR|FD|fixed deposit|deposit|receipt|certificate)\s*(?:receipt\s*)?(?:no\.?|number|#)\s*/i,
  )?.match(/[A-Z0-9][A-Z0-9/-]{3,}/i)?.[0] ?? null;
  const issueDate = parseDate(
    findLabeledValue(normalizedText, /^(?:date of issue|issue date|date of deposit|deposit date)\s*/i),
  );
  const maturityDate = parseDate(
    findLabeledValue(normalizedText, /^(?:date of maturity|maturity date|maturity)\s*/i),
  );
  const bankName = findLabeledValue(normalizedText, /^(?:bank name|bank)\s*/i);
  const branch = findLabeledValue(normalizedText, /^(?:branch name|branch)\s*/i);
  const ifscMatch = normalizedText.match(/\b[A-Z]{4}0[A-Z0-9]{6}\b/i);
  const depositor = findLabeledValue(
    normalizedText,
    /^(?:depositor|account holder|in the name of)\s*/i,
  );
  const lien = findLabeledValue(
    normalizedText,
    /^(?:lien|pledged to|in favour of|in favor of)\s*/i,
  );

  return {
    amount,
    instrumentNumber,
    issueDate,
    maturityDate,
    bankName,
    branch,
    ifsc: ifscMatch?.[0].toUpperCase() ?? null,
    depositor,
    lien,
  };
}
