export default  {
     name: 'pdfManipulate',
     description: 'Performs manipulations on a PDF file',
     parameters: {
         type: 'object',
         properties: {
             operation: {
                 type: 'string',
                 description: 'The operation to perform (addText or extractText)',
             },
             filePath: {
                 type: 'string',
                 description: 'The path to the PDF file',
             },
             text: {
                 type: 'string',
                 description: 'The text to add or search in the PDF',
             },
         },
         required: ['operation', 'filePath', 'text'],
     },
 }
