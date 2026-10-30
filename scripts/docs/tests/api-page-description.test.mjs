import { test } from 'node:test';
import assert from 'node:assert/strict';
import { withApiPageDescription } from '../lib/api-page-description.mjs';

const page = (title, extra = '') => `---\ntitle: ${title}\n${extra}full: true\n---\n\n<Comp operations={[{"path":"/v1/companies/{companyId}/contractors","method":"get"}]} />\n`;

test('describes an operation page from its title and route', () => {
  const out = withApiPageDescription(page('List contractors'), 'en');
  assert.match(out, /^title: List contractors\ndescription: "List contractors\. The GET \/v1\/companies\/\{companyId\}\/contractors endpoint of the Opero API: authentication, parameters, responses and code examples\."\n/m);
});

test('unquotes a YAML-quoted title', () => {
  const out = withApiPageDescription(page("'Get a user''s profile'"), 'en');
  assert.match(out, /description: "Get a user's profile\. The GET/);
});

test('names only the method when the route would make the description too long', () => {
  const long = page('List the relation table rows behind a dynamic form').replace('/v1/companies/{companyId}/contractors', '/v1/companies/{companyId}/forms/{formId}/records/{recordId}/relation-tables/{relationFieldKey}/query');
  const description = JSON.parse(/^description: (.+)$/m.exec(withApiPageDescription(long, 'en'))[1]);
  assert.equal(description, 'List the relation table rows behind a dynamic form. Reference for the Opero API GET endpoint: parameters, responses and code examples.');
  assert.ok(description.length <= 155);
});

test('rebuilds a description it generated earlier', () => {
  const old = page('List contractors', 'description: "List contractors. The GET /v1/old endpoint of the Opero API: parameters, responses and code examples."\n');
  assert.equal(withApiPageDescription(old, 'en'), old, 'a description for another route is not ours to rebuild');
  const ours = withApiPageDescription(page('List contractors'), 'en');
  assert.equal(withApiPageDescription(ours, 'en'), ours);
});

test('leaves pages with a description or without one operation unchanged', () => {
  const described = page('List contractors', 'description: Existing\n');
  assert.equal(withApiPageDescription(described, 'pl'), described);
  const manual = '---\ntitle: Authentication\n---\n\nHello\n';
  assert.equal(withApiPageDescription(manual, 'en'), manual);
});

test('uses the fuller wording when a short title would leave the description under 110 characters', () => {
  const description = JSON.parse(/^description: (.+)$/m.exec(withApiPageDescription(page('Get rule'), 'en'))[1]);
  assert.match(description, /authentication, request parameters, response schemas/);
  assert.ok(description.length >= 110 && description.length <= 155);
});
