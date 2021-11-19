const mySwiper = new Swiper('.swiper-container', {
	loop: true,

	// Navigation arrows
	navigation: {
		nextEl: '.slider-button-next',
		prevEl: '.slider-button-prev',
	},
});

//добавление товарар в корзину: не забыть скачать https://ospanel.io/

const buttonCart = document.querySelector('.button-cart'); //кнопка Cart
const modalCart = document.querySelector('#modal-cart'); // мод онко для добаления товарра в корзину
const modalClose = modalCart.querySelector('.modal-close'); // кнопка Крестик в модальном окне

// получение списка товаров:
const more = document.querySelector('.more'); //кнопка ViewAll
const navigationLink = document.querySelectorAll('.navigation-link'); // список элементов a, это элементыфильтра
const longGoodsList = document.querySelector('.long-goods-list'); // контейнер куда выводим спиок карточек
const cardTableGoods = document.querySelector('.cart-table__goods');
const cardTableTotal = document.querySelector('.card-table__total'); // общая сумма

//фкнция котрая получает данные с сервера:
const getGoods = async () => { // асинхронаям функция
	const result = await fetch('../db/db.json');//https://jsonplaceholder.typicode.com/todos/1 https://jsonplaceholder.typicode.com/	// возвращает промис = обещаение что ответ придет от сервера,  ждем пока не получим ответа от промиса, то есть дожидаемся когда промис выполнится

	console.log(result);
	if(!result.ok){ // если результат не ок
		throw 'Ошбика' + result.status;
	}

	return await result.json(); //  получим промис
};

const cart = {
	cartGoods: [],
	renderCart(){},
}

const openModal  = () => { 
	modalCart.classList.add('show');
};


const closeModal = () => { 
	modalCart.classList.remove('show');
};

buttonCart.addEventListener('click', openModal); //после  нажатия на кнопку buttonCart,  вызывется фукнция openModal, скобочки у функци не ставим!
modalClose.addEventListener('click', closeModal); // обработчи нажатия на кпоку Кретсик

//scroll-smooth:

const scrollLinks = document.querySelectorAll('a.scroll-link'); // находим все ссылки с  классом scroll-link, получим псевдомассив

for(let i = 0; i < scrollLinks.length; i++){

	scrollLinks[i].addEventListener('click', (evt) => {
		evt.preventDefault(); //  убираем дейсвитеи по умолчанию, скролл браузера
		const id = scrollLinks[i].getAttribute('href'); // получаем значение атбрибута href
		console.log(id);// #body
		document.querySelector(id).scrollIntoView({ // переаам объект
				behavior: 'smooth',
				block: 'start'
		});

	});

}






//console.log(getGoods()); //  получим промис
//можно писать корче:  
// fetch('../db/db.json')
// 	.then(function(response){
// 		return response.json();
//   })
// 	.then(function(data){ // data-массив
// 		console.log(data);
// })


// getGoods().then((data) { // колбэк функция выполнится только кгда then выполнится
// 	//console.log(data);
// });


const createCard = function(objCard){ // перелаем  объект-картчоку, котрый с сервера,  возвращает вертску  карточки

	const card = document.createElement('div');
	card.className =  'col-lg-3 col-sm-6'; //  добавляем divу класс
	//card.classList.add('col-lg-3 col-sm-6');
	console.log('objCard = ', objCard);

	const { name, label, id, img, price, description } = objCard; // деструтктуризация 

	card.innerHTML = `
		<div class="goods-card">
		  ${objCard.label ? `<span class="label">${label}</span>` : ''} 
			
			<img src="db/${img}" alt="${name}" class="goods-image">
			<h3 class="goods-title">${name}</h3>
			<p class="goods-description">${description}</p> 
			<button class="button goods-card-btn add-to-cart" data-id="${id}">
					<span class="button-price">${price}</span>
			</button>
	  </div>
	`;

	//console.log('card = ',  card); // <div class="col-lg-3 col-sm-6"><div class="goods-card"></div></div>
	return card;

};

const renderCards = function(data){ // передаем серверные картчоки,  показывает карточки на странице, data = [{},{},{},{},{}]
    longGoodsList.textContent = ''; // очистили конетйнер для картчоек
		//console.log('data = ', data); // [{}, {}, {}]

		const cards = data.map(createCard); // cards -массив карточек, передаем фуекцию создания разметки картчки
		//console.log(cards[0]); // cards = [ div.col-lg-3.col-sm-6, div.col-lg-3.col-sm-6 ]
		
    
		cards.forEach((card) => { // перебираем массив карточек(разметки)
			longGoodsList.append(card); // добавляем разметку картчоки в контенйер longGoodsList
		});

		//либо можно  вметсо forEach через спред опертаор ...cards применяется  к массиву:
		//longGoodsList.append(...cards); // spread оперотор разобъект на отдельные элементы массива

		document.body.classList.add('show-goods');
		//console.log('longGoodsList', longGoodsList); // рамзетку в карточками вернет 

			
};

more.addEventListener('click', (evt) => { //  после нажатия на viewAll
	evt.preventDefault(); //  чтобы страница по умолчнаиб не перезагружалась
	getGoods().then(renderCards); // откроется спсиок
});




// const arr = [
// 	{
// 		"id": "015",
// 		"img": "img/713S476iemL.jpg",
// 		"name": "Derek Rose Men's Short Sleeve T-Shirt",
// 		"label": "Bestseller",
// 		"description": "Charcoal",
// 		"price": "119",
// 		"category": "Clothing",
// 		"gender": "Mens"
//   }, 
	
// 	{
// 		"id": "016",
// 		"img": "img/61BjZJm0AaL.jpg",
// 		"name": "LEKODE Men Beach Shorts Drawstring Print Pocket Fashion Casual Swim Pants",
// 		"label": "Bestseller",
// 		"description": "Red-Cola",
// 		"price": "19",
// 		"category": "Clothing",
// 		"gender": "Mens"
//   }
	
// ];


//renderCards(arr);


const filterCards = function(field, value){ // field- свойство , value- его значение
	getGoods()
		.then((data) => { // ерелаем серверные картчоки
			const filteredGoods = data.filter((good) => good[field] === value); //  перелаем объект {} -товар
					// return	good[field] === value; // true/false , если true, то good= {} добавляется  в массив filteredGoods
			

			return filteredGoods; // получаем массив отфитрованных картчоек [{},{},{}]
		})
		.then(renderCards);
};




navigationLink.forEach(function(link){ // проходимся по всем link  из массива
		link.addEventListener('click', (evt) =>{ // на все link навешиваем обработчик события
				evt.preventDefault();
				const field = link.dataset.field; // чтобыполучить значения дата-атрибутов datd-field
				const value = link.textContent;
				console.log('field', field);
				console.log('value', value);
				filterCards(field, value);
		});
});