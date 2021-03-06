import { existsSync, promises } from 'fs';
import { isFrontend, createCompletionList } from '../util';

const { readFile, stat } = promises;
const cache = new Map();

const lastModifiedTime = async (path) => {
  try {
    const { mtimeMs } = await stat(path);

    return mtimeMs;
  } catch (error) { /**/ }
};

const getCompletions = async (filePath) => {
  const mtimeMs = await lastModifiedTime(filePath);

  if (cache.has(filePath)) {
    const data = cache.get(filePath);

    if (data.mtimeMs === mtimeMs) {
      return data.completions;
    }
  }

  try {
    const file = await readFile(filePath, 'utf8');
    const { content } = JSON.parse(file);
    const json = Buffer.from(content.content, 'base64').toString('utf8');
    const { data } = JSON.parse(json);

    const items = Object.values(data.connections_data)
      .map((element) => {
        const [item] = element.items;

        return {
          kind: 6,
          name: item.role,
        };
      });

    const completions = createCompletionList(items);

    cache.set(filePath, { completions, mtimeMs });

    return completions;
  } catch (error) {
    cache.clear();
  }
};

export const roles = {
  provideCompletionItems(doc, position) {
    if (!isFrontend(doc.uri.path)) {
      return;
    }

    const prefix = doc.lineAt(position).text.substr(0, position.character).trim();

    if (/^[^$(a-z)+]\(['"`]#[a-z\d]+['"`]\)/i.test(prefix)) {
      return;
    }

    const filePath = doc.fileName.slice(0, -2).concat('wix');

    if (existsSync(filePath)) {
      return getCompletions(filePath);
    }
  },
};
