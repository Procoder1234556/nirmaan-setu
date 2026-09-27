const fs = require('fs');
const path = require('path');

function fixFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace wasp/entities with @prisma/client
  content = content.replace(/from "wasp\/entities"/g, 'from "@prisma/client"');

  // Replace HttpError from wasp/server
  content = content.replace(/import { HttpError } from "wasp\/server";/g, 'import { HttpError } from "../server/validation";');
  content = content.replace(/import \{ env, HttpError, type MiddlewareConfigFn \} from "wasp\/server";/g, 'import { env } from "../env";\nimport { HttpError } from "../server/validation";');
  content = content.replace(/import \{ env \} from "wasp\/server";/g, 'import { env } from "../env";');

  // Replace wasp/server/operations imports
  content = content.replace(/import type \{[^}]*\} from "wasp\/server\/operations";/g, '');

  // Strip generic types for actions
  content = content.replace(/export const ([a-zA-Z0-9_]+): [a-zA-Z0-9_]+<[^>]+>\s*=\s*async \(([^)]+)\) =>/g, 'export const $1 = async ($2: any, context?: any) =>');
  
  // Specific match for `_args, context` since it might not match above if it spans lines
  content = content.replace(/export const ([a-zA-Z0-9_]+): [a-zA-Z0-9_]+<\s*[^,]+,\s*[^>]+\s*>\s*=\s*async \(([^)]+)\) =>/g, 'export const $1 = async ($2: any, context?: any) =>');

  fs.writeFileSync(filePath, content);
  console.log('Fixed', filePath);
}

fixFile(path.join(__dirname, 'src', 'demo-ai-app', 'operations.ts'));
fixFile(path.join(__dirname, 'src', 'file-upload', 'operations.ts'));
fixFile(path.join(__dirname, 'src', 'payment', 'operations.ts'));
