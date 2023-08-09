const fs = require('fs');
const { pathMaker } = require('./path');


filePath  = pathMaker('input_data','africa.json')
filteredPath = pathMaker('input_data','africa_filtered.json')

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the JSON file:', err);
      return;
    }
  
    try {
      const jsonData = JSON.parse(data);
      
      const filtered = jsonData.map(element => {
            return element.name; 
          

      });
      console.log(filtered)
      const jsonString = JSON.stringify(filtered, null, 2);

      fs.writeFile(filteredPath, jsonString, 'utf8', err => {
        if (err) {
          console.error('Error writing the JSON file:', err);
          return;
        }
        console.log('Filtered data written to file:', filteredPath);
      });

    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
    }
  });

  
  
  