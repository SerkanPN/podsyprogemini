import fs from 'fs';
import https from 'https';

const URL = 'https://www.etsy.com/openapi/generated/oas/3.0.0.json';
const OUTPUT_FILE = 'etsy_api_reference.md';

function generateDocs(openapi) {
  let md = '# Etsy OpenAPI v3 Reference\n\n';
  md += 'This document contains all endpoints and their detailed response structures directly from the official Etsy v3 OpenAPI specification.\n\n';
  
  const resolveRef = (ref, doc) => {
    if (!ref) return null;
    const parts = ref.replace('#/', '').split('/');
    let current = doc;
    for (const p of parts) {
      if (current[p]) current = current[p];
      else return null;
    }
    return current;
  };
  
  const formatSchema = (schema, doc, indent = '') => {
    if (!schema) return 'any';
    if (schema.$ref) {
      const resolved = resolveRef(schema.$ref, doc);
      return formatSchema(resolved, doc, indent);
    }
    
    if (schema.type === 'object') {
      let out = 'Object {\n';
      for (const [key, prop] of Object.entries(schema.properties || {})) {
        let typeStr = prop.type || 'any';
        if (prop.$ref) {
          const res = resolveRef(prop.$ref, doc);
          typeStr = res ? res.type || 'Object' : 'Object';
        }
        out += `${indent}  - **${key}** (${typeStr}): ${prop.description || ''}\n`;
      }
      out += `${indent}}`;
      return out;
    } else if (schema.type === 'array') {
      return `Array of ${formatSchema(schema.items, doc, indent + '  ')}`;
    } else {
      return schema.type || 'any';
    }
  };

  for (const [path, methods] of Object.entries(openapi.paths)) {
    for (const [method, operation] of Object.entries(methods)) {
      md += `## \`${method.toUpperCase()} ${path}\`\n`;
      md += `**Summary:** ${operation.summary || ''}\n\n`;
      md += `**Description:** ${operation.description || ''}\n\n`;
      
      if (operation.parameters && operation.parameters.length > 0) {
        md += '### Parameters\n';
        for (const param of operation.parameters) {
          const resolved = param.$ref ? resolveRef(param.$ref, openapi) : param;
          md += `- \`${resolved.name}\` (${resolved.in}): ${resolved.description || ''}\n`;
        }
        md += '\n';
      }
      
      const successRes = operation.responses['200'] || operation.responses['201'];
      if (successRes) {
        md += '### Response Structure\n';
        const resObj = successRes.$ref ? resolveRef(successRes.$ref, openapi) : successRes;
        if (resObj.content && resObj.content['application/json']) {
          const schema = resObj.content['application/json'].schema;
          md += formatSchema(schema, openapi);
        } else {
          md += 'No JSON response body.\n';
        }
        md += '\n\n---\n\n';
      }
    }
  }
  return md;
}

https.get(URL, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(body);
      const markdown = generateDocs(json);
      fs.writeFileSync(OUTPUT_FILE, markdown);
      console.log('Documentation generated successfully to ' + OUTPUT_FILE);
    } catch (e) {
      console.error('Error generating docs:', e);
    }
  });
}).on('error', console.error);
