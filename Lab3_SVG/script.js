window.addEventListener('DOMContentLoaded', init);

const svgContainer = document.getElementById('svgContainer');
const svgBoxForItems = document.getElementById('svgBoxForItems');
const draggableItemsContainer = document.getElementById('draggableItemsContainer');
const snapToGridCheckbox = document.getElementById('snapToGrid');

const scaleAllItemsValue = 1.5;
let isDragging = false;
let currentDraggingElement = null;
let dragOffset = {x: 0, y: 0};
const gridSize = 50;
const svgBounds = {minX: 0,minY: 0,maxX: 1000,maxY: 1000};

// элементы 
const itemsList = [
    { id: 'bath', name: 'bath.svg', width: 120, height: 120 },
    { id: 'bed', name: 'bed.svg', width: 120, height: 120 },
    { id: 'cabinet', name: 'cabinet.svg', width: 80, height: 80 },
    { id: 'carpet', name: 'carpet.svg', width: 100, height: 100 },
    { id: 'sink', name: 'sink.svg', width: 80, height: 80 },
    { id: 'sofa', name: 'sofa.svg', width: 120, height: 120 },
    { id: 'sofa2', name: 'sofa2.svg', width: 120, height: 120 },
    { id: 'stove', name: 'stove.svg', width: 80, height: 80 },
    { id: 'table_with_chairs', name: 'table_with_chairs.svg', width: 100, height: 100 },
    { id: 'table_with_pc', name: 'table_with_pc.svg', width: 120, height: 120 },
    { id: 'table', name: 'table.svg', width: 80, height: 80 },
    { id: 'toilet', name: 'toilet.svg', width: 50, height: 50 }
];

function scaleAllItemsInit()
{
    itemsList.forEach((item, index) => {
        item.width *= scaleAllItemsValue;
        item.height *= scaleAllItemsValue;
    });
}

//  Инициализация
function init() {
    scaleAllItemsInit();
    loadItemsToSidebar();
    setupEventListeners();
}

//  Загрузка элементов на боковую панель
function loadItemsToSidebar() {
    const sidebarGridSize = 100;
    const itemsPerRow = 2;
    const margin = 35;
    
    itemsList.forEach((item, index) => {
        const row = Math.floor(index / itemsPerRow);
        const col = index % itemsPerRow;
        
        const x = margin + col * (sidebarGridSize + margin);
        const y = margin + row * (sidebarGridSize + margin);
        
        const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
        image.setAttribute('href', `assets/${item.name}`);
        image.setAttribute('x', x);
        image.setAttribute('y', y);
        image.setAttribute('width', sidebarGridSize);
        image.setAttribute('height', sidebarGridSize);
        image.setAttribute('id', 'item-icon');
        image.setAttribute('item-id', item.id);
        image.setAttribute('item-name', item.name);
        image.setAttribute('original-width', item.width);
        image.setAttribute('original-height', item.height);
        
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x + sidebarGridSize / 2);
        text.setAttribute('y', y + sidebarGridSize + 15);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('font-size', '12');
        text.textContent = item.name.replace('.svg', '');
        
        svgBoxForItems.appendChild(image);
        svgBoxForItems.appendChild(text);
        
        image.addEventListener('mousedown', startDragFromSidebar);
        image.addEventListener('touchstart', startDragFromSidebarTouch);
    });
}

// Настройка обработчиков событий
function setupEventListeners() {
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchmove', dragTouch);
    document.addEventListener('touchend', stopDrag);
}

// Начало перетаскивания с боковой панели
function startDragFromSidebar(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const itemId = e.target.getAttribute('item-id');
    const itemName = e.target.getAttribute('item-name');
    const originalWidth = parseFloat(e.target.getAttribute('original-width'));
    const originalHeight = parseFloat(e.target.getAttribute('original-height'));
    
    // новый элемент
    const svgRect = svgContainer.getBoundingClientRect();
    const x = e.clientX - svgRect.left - originalWidth / 2;
    const y = e.clientY - svgRect.top - originalHeight / 2;
    
    createDraggableItem(itemId, itemName, originalWidth, originalHeight, x, y);
    
    // Начало перетаскивание элемента
    currentDraggingElement = document.querySelector(`[instance-id="${itemId}"]`);
    dragOffset.x = originalWidth / 2;
    dragOffset.y = originalHeight / 2;
    isDragging = true;
    
    currentDraggingElement.classList.add('dragging');
    svgContainer.style.cursor = 'grabbing';
}

function startDragFromSidebarTouch(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const touch = e.touches[0];
    startDragFromSidebar({ 
        target: e.target,
        clientX: touch.clientX, 
        clientY: touch.clientY,
        preventDefault: () => {},
        stopPropagation: () => {}
    });
}

// Создание перетаскиваемого элемента
function createDraggableItem(itemId, itemName, width, height, x, y) {
    const instanceId = `${itemId}`;
    
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('id', 'draggable-item');
    group.setAttribute('instance-id', instanceId);
    group.setAttribute('item-id', itemId);
    
    // Применяем привязку к сетке если включена
    let posX = Math.max(svgBounds.minX, Math.min(svgBounds.maxX - width, x));
    let posY = Math.max(svgBounds.minY, Math.min(svgBounds.maxY - height, y));
    
    if (snapToGridCheckbox.checked) {
        posX = Math.round(posX / gridSize) * gridSize;
        posY = Math.round(posY / gridSize) * gridSize;
    }
    
    const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    image.setAttribute('href', `assets/${itemName}`);
    image.setAttribute('x', posX);
    image.setAttribute('y', posY);
    image.setAttribute('width', width);
    image.setAttribute('height', height);
    image.setAttribute('original-width', width);
    image.setAttribute('original-height', height);
    
    group.appendChild(image);
    draggableItemsContainer.appendChild(group);
    
    // Добавляем обработчики для созданного элемента
    group.addEventListener('mousedown', startDragExisting);
    group.addEventListener('touchstart', startDragExistingTouch);
    
    return group;
}

// Начало перетаскивания элемента
function startDragExisting(e) {
    e.preventDefault();
    e.stopPropagation();
    
    // Ищем родительский группу если кликнули на image
    currentDraggingElement = e.target.tagName === 'g' ? e.target : e.target.parentNode;
    
    const image = currentDraggingElement.querySelector('image');
    
    const svgRect = svgContainer.getBoundingClientRect();
    const currentX = parseFloat(image.getAttribute('x'));
    const currentY = parseFloat(image.getAttribute('y'));
    
    dragOffset.x = e.clientX - svgRect.left - currentX;
    dragOffset.y = e.clientY - svgRect.top - currentY;
    
    isDragging = true;
    currentDraggingElement.classList.add('dragging');
    svgContainer.style.cursor = 'grabbing';
}

function startDragExistingTouch(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const touch = e.touches[0];
    startDragExisting({ 
        target: e.target,
        clientX: touch.clientX, 
        clientY: touch.clientY,
        preventDefault: () => {},
        stopPropagation: () => {}
    });
}

// Перетаскивание
function drag(e) {
    if (!isDragging || !currentDraggingElement) return;
    
    const svgRect = svgContainer.getBoundingClientRect();
    const x = e.clientX - svgRect.left - dragOffset.x;
    const y = e.clientY - svgRect.top - dragOffset.y;
    
    updateElementPosition(currentDraggingElement, x, y);
}

function dragTouch(e) {
    if (!isDragging || !currentDraggingElement) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    drag({ clientX: touch.clientX, clientY: touch.clientY });
}

// Обновление позиции элемента
function updateElementPosition(element, newX, newY) {
    const image = element.querySelector('image');
    let width = parseFloat(image.getAttribute('width'));
    let height = parseFloat(image.getAttribute('height'));
    
    const transform = image.getAttribute('transform') || '';

    // Ограничиваем границами с учетом поворота
    let targetX = Math.max(svgBounds.minX, Math.min(svgBounds.maxX - width, newX));
    let targetY = Math.max(svgBounds.minY, Math.min(svgBounds.maxY - height, newY));
    
    // Привязка к сетке
    if (snapToGridCheckbox.checked) {
        targetX = Math.round(targetX / gridSize) * gridSize;
        targetY = Math.round(targetY / gridSize) * gridSize;
    }
    
    image.setAttribute('x', targetX);
    image.setAttribute('y', targetY);
    
    // Обновляем центр вращения если есть трансформация
    if (transform.includes('rotate(')) {
        // с новым центром
        const centerX = targetX + width / 2;
        const centerY = targetY + height / 2;
        
        // сохранение угла старого transform
        const match = transform.match(/rotate\((\d+)/);
        if (match) {
            const angle = match[1];
            image.setAttribute('transform', `rotate(${angle} ${centerX} ${centerY})`);
        }
    }
}

// Остановка перетаскивания
function stopDrag() {
    if (!isDragging) return;
    
    if (currentDraggingElement) {
        isDragging = false;
    }
    
    isDragging = false;
    currentDraggingElement = null;
    svgContainer.style.cursor = 'grab';
}


// Очистка всех свг
function clearAllItems() {
    while (draggableItemsContainer.firstChild) {
        draggableItemsContainer.removeChild(draggableItemsContainer.firstChild);
    }
}

function saveAll() {
    
}

function rotateItem(element) {
    const image = element.querySelector('image');
    
    const x = parseFloat(image.getAttribute('x'));
    const y = parseFloat(image.getAttribute('y'));
    const width = parseFloat(image.getAttribute('width'));
    const height = parseFloat(image.getAttribute('height'));
    
    // цнтр элемента
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    
    // получаем текущий поворот
    let currentTransform = image.getAttribute('transform') || '';
    
    let currentAngle = 0;
    if (currentTransform.includes('rotate(')) {
        // Извлекаем текущий угол из transform
        const match = currentTransform.match(/rotate\((\d+)/);
        currentAngle = parseInt(match[1]);
    }

    const newAngle = (currentAngle + 45) % 360;
    image.setAttribute('transform', `rotate(${newAngle} ${centerX} ${centerY})`);
    
    console.log("rotateItem()", image.getAttribute('transform'));
}

// Удаление элемента
document.addEventListener('keydown', function(e) {
    if (e.key === 'Delete') {
        if (currentDraggingElement) {
            if (currentDraggingElement.parentNode == draggableItemsContainer) {
                draggableItemsContainer.removeChild(currentDraggingElement);
            }
        }
    }
    if (e.key === 'r' || e.key === 'R') {
        if (currentDraggingElement) {
            if (currentDraggingElement.parentNode == draggableItemsContainer) {
                rotateItem(currentDraggingElement);
            }
        }
    }
});

