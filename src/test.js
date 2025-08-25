const title = document.getElementById('exercise-title');
title.innerText = 'DOM Manipulation Exercise';
const paragraph = document.getElementById('exercise-paragraph');
paragraph.classList.add('highlight');
const item = document.CreateElement('li');
item.innerText = 'Item 4';
const list = document.getElementById('exercise-list');
list.appendChild(item);
const remove = document.getElementById('exercise-remove');
remove.remove();
const link = document.getElementById('exercise-link');
link.href = 'https://www.example.com';
link.setAttribute('href', 'example.com');


const images = [
    {
    src: "/images/car1.png",
    alt: "Red sports car",
  },
  {
    src: "/images/car2.png",
    alt: "Blue sedan car",
  },
  {
    src: "/images/car3.png",
    alt: "Green electric car",
  },
  {
    src: "/images/car4.png",
    alt: "Yellow vintage car",
  },
];

function Gallery() {
    return (
        <div>
            {images.map((image, index) => (
                <img key={index} src={image.src} alt={image.alt}/>
            ))}
        </div>
    );
}