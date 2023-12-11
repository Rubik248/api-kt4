const dropArea = document.getElementById('dropArea');
const fileInput = document.getElementById('fileInput');
const sizeFilter = document.getElementById('sizeFilter');
const typeFilter = document.getElementById('typeFilter');
const fileList = document.getElementById('fileList');

dropArea.addEventListener('dragover', function(e) {
  e.preventDefault();
  dropArea.classList.add('dragover');
});

dropArea.addEventListener('dragleave', function() {
  dropArea.classList.remove('dragover');
});

dropArea.addEventListener('drop', function(e) {
  e.preventDefault();
  dropArea.classList.remove('dragover');
  handleFiles(e.dataTransfer.files);
});

fileInput.addEventListener('change', function(e) {
  handleFiles(e.target.files);
});

function handleFiles(files) {
  for (const file of files) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const fileDetails = {
        name: file.name,
        type: file.type,
        size: file.size,
        data: e.target.result
      };
      saveFile(fileDetails);
      displayFiles();
    };
    reader.readAsDataURL(file);
  }
}

function saveFile(file) {
  let files = JSON.parse(localStorage.getItem('files')) || [];
  files.push(file);
  localStorage.setItem('files', JSON.stringify(files));
}

function displayFiles() {
  fileList.innerHTML = '';
  const files = JSON.parse(localStorage.getItem('files')) || [];
  files.forEach(function(file) {
    const fileSizeKB = Math.round(file.size / 1024);
    if ((!sizeFilter.value || fileSizeKB <= sizeFilter.value) &&
        (!typeFilter.value || file.type === typeFilter.value)) {
      const fileDiv = document.createElement('div');
      fileDiv.classList.add('file');
      fileDiv.innerHTML = `
        <p>Name: ${file.name}</p>
        <p>Type: ${file.type}</p>
        <p>Size: ${fileSizeKB} KB</p>
      `;
      if (file.type.startsWith('image/')) {
        const image = document.createElement('img');
        image.src = file.data;
        fileDiv.appendChild(image);
      }
      fileList.appendChild(fileDiv);
    }
  });
}

function filterFiles() {
  displayFiles();
}