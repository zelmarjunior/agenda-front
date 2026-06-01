const STORAGE_KEY_PREFIX = 'wa_template_';

export const DEFAULT_WA_TEMPLATE =
  'Olá {{apelido}}! 😊 Confirmando seu agendamento de *{{servico}}* com {{profissional}} no dia *{{data}}* às *{{horario}}*. Te esperamos! 💇‍♀️';

export interface WaTemplateVars {
  nome: string;
  apelido: string;
  horario: string;
  data: string;
  servico: string;
  profissional: string;
}

export const WA_VARIABLES: { key: keyof WaTemplateVars; label: string; description: string }[] = [
  { key: 'apelido', label: '{{apelido}}', description: 'Primeiro nome da cliente' },
  { key: 'nome', label: '{{nome}}', description: 'Nome completo da cliente' },
  { key: 'horario', label: '{{horario}}', description: 'Horário do agendamento (ex: 14:30)' },
  { key: 'data', label: '{{data}}', description: 'Data por extenso (ex: segunda, 2 de junho)' },
  { key: 'servico', label: '{{servico}}', description: 'Nome do serviço' },
  { key: 'profissional', label: '{{profissional}}', description: 'Nome do profissional' },
];

export function getWaTemplate(businessId: string): string {
  if (typeof window === 'undefined') return DEFAULT_WA_TEMPLATE;
  return localStorage.getItem(`${STORAGE_KEY_PREFIX}${businessId}`) ?? DEFAULT_WA_TEMPLATE;
}

export function saveWaTemplate(businessId: string, template: string): void {
  localStorage.setItem(`${STORAGE_KEY_PREFIX}${businessId}`, template);
}

export function buildWaMessage(template: string, vars: WaTemplateVars): string {
  return template
    .replace(/\{\{nome\}\}/g, vars.nome)
    .replace(/\{\{apelido\}\}/g, vars.apelido)
    .replace(/\{\{horario\}\}/g, vars.horario)
    .replace(/\{\{data\}\}/g, vars.data)
    .replace(/\{\{servico\}\}/g, vars.servico)
    .replace(/\{\{profissional\}\}/g, vars.profissional);
}

export function buildWaUrl(phone: string, message: string): string {
  const digits = phone.replace(/\D/g, '');
  const number = digits.startsWith('55') ? digits : `55${digits}`;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
