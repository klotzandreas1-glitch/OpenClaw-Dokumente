import type { Answers } from '../types';

export function encodeAnswers(answers: Answers): string {
  const json = JSON.stringify(answers);
  return btoa(unescape(encodeURIComponent(json)));
}

export function decodeAnswers(encoded: string): Answers {
  try {
    const json = decodeURIComponent(escape(atob(encoded)));
    return JSON.parse(json) as Answers;
  } catch {
    return {};
  }
}

export function buildMandantLink(
  baseUrl: string,
  mandantId: string,
  clientName: string,
  answers: Answers,
): string {
  const params = new URLSearchParams({
    mandant: mandantId,
    name: clientName,
    vorjahr: encodeAnswers(answers),
  });
  return `${baseUrl}?${params.toString()}`;
}

export function parseMandantUrl(): {
  mandantId: string;
  clientName: string;
  vorjahrAnswers: Answers;
  isAdmin: boolean;
} {
  const params = new URLSearchParams(window.location.search);
  return {
    mandantId: params.get('mandant') ?? '',
    clientName: params.get('name') ?? '',
    vorjahrAnswers: params.has('vorjahr') ? decodeAnswers(params.get('vorjahr')!) : {},
    isAdmin: params.has('admin'),
  };
}
