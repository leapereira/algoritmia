import { foundationVisuals } from './lesson-visuals-foundations.js';
import { advancedVisuals } from './lesson-visuals-advanced.js';
import { moduleVisuals } from './module-art.js';

export type LearningVisual = { title: string; description: string; svg: string };
export const lessonVisuals: Record<string, LearningVisual> = { ...foundationVisuals, ...advancedVisuals };
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]!));

export function learningVisual(kind: string, id: string): LearningVisual | undefined {
  return kind === 'module' ? moduleVisuals[Number(id)] : kind === 'lesson' ? lessonVisuals[id] : undefined;
}

export function visualSvg(visual: LearningVisual): string {
  return visual.svg.includes('xmlns=') ? visual.svg : visual.svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
}

export function bindFigureNavigation(root: ParentNode): void {
  for (const canvas of root.querySelectorAll<HTMLElement>('.learning-figure-canvas')) {
    canvas.addEventListener('keydown', event => {
      if (event.target !== canvas || event.altKey || event.ctrlKey || event.metaKey) return;
      const offsets: Record<string, number> = { ArrowLeft: canvas.scrollLeft - 80, ArrowRight: canvas.scrollLeft + 80, Home: 0, End: canvas.scrollWidth };
      if (!(event.key in offsets)) return;
      event.preventDefault();
      canvas.scrollLeft = offsets[event.key];
    });
  }
}

export function learningFigure(kind: 'module' | 'lesson', id: string | number): string {
  const visual = learningVisual(kind, String(id));
  if (!visual) return '';
  return `<figure class="learning-figure" data-learning-figure="${kind}/${escapeHtml(String(id))}">
    <div class="learning-figure-heading"><span class="eyebrow">${kind === 'module' ? 'EL MÓDULO EN UN EJEMPLO' : 'MIRA LA IDEA'}</span><h2>${escapeHtml(visual.title)}</h2></div>
    <div class="learning-figure-canvas" tabindex="0" role="region" aria-label="Esquema: ${escapeHtml(visual.title)}">${visual.svg}</div>
    <figcaption><p>${escapeHtml(visual.description)}</p><div class="learning-figure-actions"><span class="figure-scroll-hint">Desliza el esquema para ver todos los detalles.</span><button type="button" class="btn btn-secondary btn-small" data-action="expand-figure" data-kind="${kind}" data-id="${escapeHtml(String(id))}">Ampliar esquema <span aria-hidden="true">↗</span></button></div></figcaption>
  </figure>`;
}

export function expandedFigure(kind: string, id: string): string {
  const visual = learningVisual(kind, id);
  if (!visual) return '';
  const href = `./figures/${kind}/${encodeURIComponent(id)}.svg`;
  return `<div class="figure-dialog-heading"><div><span class="eyebrow">ESQUEMA DE ESTUDIO</span><h2>${escapeHtml(visual.title)}</h2></div><form method="dialog"><button class="icon-btn" aria-label="Cerrar esquema">×</button></form></div>
    <div class="learning-figure-canvas expanded-canvas" tabindex="0" role="region" aria-label="Esquema ampliado: ${escapeHtml(visual.title)}">${visual.svg}</div>
    <p class="figure-dialog-description">${escapeHtml(visual.description)}</p>
    <div class="figure-dialog-footer"><span>Puedes guardar el esquema para repasar.</span><a class="btn btn-secondary btn-small" href="${href}" download="algoritmia-${escapeHtml(id)}.svg">Descargar imagen SVG</a></div>`;
}
