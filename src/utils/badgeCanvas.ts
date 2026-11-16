export interface BadgeRenderOptions {
  score: number;
  track: string;
  company: string;
  readinessLabel: string;
  personaName: string;
  dateLabel?: string;
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines = 3
): number {
  const words = text.split(' ');
  let line = '';
  let currentY = y;
  let linesDrawn = 0;

  for (let i = 0; i < words.length; i++) {
    const testLine = line ? `${line} ${words[i]}` : words[i];
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && line) {
      linesDrawn++;
      if (linesDrawn >= maxLines) {
        ctx.fillText(`${line}...`, x, currentY);
        return currentY + lineHeight;
      }
      ctx.fillText(line, x, currentY);
      line = words[i];
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }

  if (line) {
    ctx.fillText(line, x, currentY);
    currentY += lineHeight;
  }

  return currentY;
}

export function renderReadinessBadgeToCanvas(
  canvas: HTMLCanvasElement,
  options: BadgeRenderOptions
): string {
  const width = 1200;
  const height = 630;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Deep slate-indigo gradient backdrop
  const bgGradient = ctx.createLinearGradient(0, 0, width, height);
  bgGradient.addColorStop(0, '#0B1120');
  bgGradient.addColorStop(0.55, '#111827');
  bgGradient.addColorStop(1, '#0F172A');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);

  // Subtle architectural grid lines
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.07)';
  ctx.lineWidth = 1;
  for (let x = 60; x < width; x += 60) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 60; y < height; y += 60) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Soft emerald & indigo glow accents (restrained)
  const emeraldGlow = ctx.createRadialGradient(980, 140, 20, 980, 140, 320);
  emeraldGlow.addColorStop(0, 'rgba(16, 185, 129, 0.18)');
  emeraldGlow.addColorStop(1, 'rgba(16, 185, 129, 0)');
  ctx.fillStyle = emeraldGlow;
  ctx.fillRect(0, 0, width, height);

  const indigoGlow = ctx.createRadialGradient(180, 520, 20, 180, 520, 340);
  indigoGlow.addColorStop(0, 'rgba(99, 102, 241, 0.16)');
  indigoGlow.addColorStop(1, 'rgba(99, 102, 241, 0)');
  ctx.fillStyle = indigoGlow;
  ctx.fillRect(0, 0, width, height);

  // Outer card frame
  drawRoundedRect(ctx, 44, 44, width - 88, height - 88, 24);
  ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.22)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Top label bar
  ctx.fillStyle = '#34D399';
  ctx.font = '600 18px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText('SMART MOCK INTERVIEWER · NED UNIVERSITY EDITION', 92, 114);

  // Main Headline matching prompt spec: "Interview Ready: [Score]/100 – [Track] @ [Company]"
  const headline = `Interview Ready: ${options.score}/100 – ${options.track} @ ${options.company}`;
  ctx.fillStyle = '#F8FAFC';
  ctx.font = '700 38px "Plus Jakarta Sans", system-ui, sans-serif';
  const afterHeadlineY = wrapText(ctx, headline, 92, 188, 670, 50, 3);

  // Readiness classification & Persona metadata
  ctx.fillStyle = '#94A3B8';
  ctx.font = '500 22px "DM Sans", system-ui, sans-serif';
  ctx.fillText(
    `Assessment: ${options.readinessLabel}  ·  Panel: ${options.personaName}`,
    92,
    Math.max(afterHeadlineY + 34, 340)
  );

  // Bottom divider line
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(92, 470);
  ctx.lineTo(750, 470);
  ctx.stroke();

  // Footer metadata
  const dateStr =
    options.dateLabel ||
    new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  ctx.fillStyle = '#CBD5E1';
  ctx.font = '500 18px "JetBrains Mono", monospace';
  ctx.fillText(`VERIFIED PRACTICE REPORT  ·  ${dateStr}`, 92, 518);

  // Right side circular progress gauge
  const centerX = 955;
  const centerY = 315;
  const radius = 128;

  // Background ring
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.18)';
  ctx.lineWidth = 20;
  ctx.stroke();

  // Active score arc
  const clampedScore = Math.max(0, Math.min(100, options.score));
  const startAngle = -Math.PI / 2;
  const endAngle = startAngle + (Math.PI * 2 * clampedScore) / 100;

  const arcGrad = ctx.createLinearGradient(
    centerX - radius,
    centerY - radius,
    centerX + radius,
    centerY + radius
  );
  arcGrad.addColorStop(0, '#6366F1');
  arcGrad.addColorStop(1, '#10B981');

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, startAngle, endAngle);
  ctx.strokeStyle = arcGrad;
  ctx.lineWidth = 20;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Score text inside ring
  ctx.textAlign = 'center';
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 68px "JetBrains Mono", monospace';
  ctx.fillText(String(clampedScore), centerX, centerY + 14);

  ctx.fillStyle = '#94A3B8';
  ctx.font = '600 18px "JetBrains Mono", monospace';
  ctx.fillText('OUT OF 100', centerX, centerY + 52);

  ctx.textAlign = 'left';

  return canvas.toDataURL('image/png');
}
