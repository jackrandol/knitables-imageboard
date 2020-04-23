const reader = new FileReader();

reader.readAsDataURL('/uploads/'
);
const img = new Image();
img.src = event.target.result;
const elem = document.createElement('canvas');
elem.width = width;
elem.height = height;

const ctx = elem.getContext('2d')
