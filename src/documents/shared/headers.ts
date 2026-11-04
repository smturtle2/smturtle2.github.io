import type { Locale } from '../../i18n';
import { profile } from '../../data/profile';
import { projects, type ProjectId, type ProjectLinkId } from '../../data/projects';
import type { DocumentHeader, Header } from '../core/model';

export function profileHeader(locale: Locale): DocumentHeader {
  return {
    title: profile.names[locale],
    profileRole: profile.role,
    contacts: [
      { label: profile.email, href: `mailto:${profile.email}` },
      { label: profile.github.replace('https://', ''), href: profile.github },
      { label: profile.huggingface.replace('https://', ''), href: profile.huggingface },
    ],
  };
}

export function projectHeader<P extends ProjectId>(
  id: P,
  locale: Locale,
  content: Pick<Header, 'title' | 'subtitle' | 'linksLabel'> & { linkLabels: Record<ProjectLinkId<P>, string> },
): Header {
  const facts = projects[id];
  const labels: Readonly<Record<string, string>> = content.linkLabels;
  return {
    title: content.title,
    subtitle: content.subtitle,
    period: facts.period[locale],
    note: facts.context[locale],
    linksLabel: content.linksLabel,
    links: Object.entries(facts.links).map(([key, href]) => ({ label: labels[key], href })),
  };
}
