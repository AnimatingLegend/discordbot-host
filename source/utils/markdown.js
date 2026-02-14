module.exports = {
     cleanMD: (content) => {
          if (!content) return "";

          let cleaned = content.replace(/\r/g, '');

          // --- Space out Headers --- \\
          cleaned = cleaned.replace(/^### (.*$)/gm, '\n〉**$1**');
          cleaned = cleaned.replace(/^## (.*$)/gm, '\n══ **$1** ══');

          // --- Fix Hyperlinks --- \\
          cleaned = cleaned.replace(/\[(.*?)\]\(\.\/(.*?)\)/g, '[$1](https://github.com/your-repo/blob/main/$2)');

          const lines = cleaned.split('\n');
          const formattedLines = lines.map(line => {
               const trimmed = line.trim();
               if (!trimmed) return ""; // -- Intentionally keep blank -- \\

               // -- Root level headers -- \\
               if (line.startsWith('- **') || line.startsWith('* **')) {
                    return `\n:large_blue_diamond: ${trimmed}`;
               }

               // -- Sub Headers -- \\
               if (line.match(/^\s*([*-]|o) /) && line.indexOf('-') < 6) {
                    return `  * ${trimmed.replace(/^[*-] |^o /, '')}`;
               }

               // -- Highly nested headers -- \\
               if (line.match(/^\s+([*-]|o) /)) {
                    return `      L *${trimmed.replace(/^[*-] |^o /, '')}*`;
               }

               return line;
          });

          return formattedLines.join('\n').replace(/\n\n\n+/g, '\n\n').trim();
     }
};