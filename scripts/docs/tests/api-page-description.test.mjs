import { test } from 'node:test';
import assert from 'node:assert/strict';
import { withApiPageDescription } from '../lib/api-page-description.mjs';

const page = (title, extra = '') => `---\ntitle: ${title}\n${extra}full: true\n---\n\n<Comp operations={[{"path":"/v1/companies/{companyId}/contractors","method":"get"}]} />\n`;

test('describes an operation page from its title and route', () => {
  const out = withApiPageDescription(page('List contractors'), 'en');
  assert.match(out, /^title: List contractors\ndescription: "List contractors\. The GET \/v1\/companies\/\{companyId\}\/contractors endpoint of the Opero API: parameters, responses and code examples\."\n/m);
});

test('unquotes a YAML-quoted title', () => {
  const out = withApiPageDescription(page("'Get a user''s profile'"), 'en');
  assert.match(out, /description: "Get a user's profile\. The GET/);
});

test('leaves pages with a description or without one operation unchanged', () => {
  const described = page('List contractors', 'description: Existing\n');
  assert.equal(withApiPageDescription(described, 'pl'), described);
  const manual = '---\ntitle: Authentication\n---\n\nHello\n';
  assert.equal(withApiPageDescription(manual, 'en'), manual);
});
