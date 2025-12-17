// Элементы
const svgContainer = document.getElementById('svgContainer');
const draggableSquare = document.getElementById('draggableSquare');
const centerDot = document.getElementById('centerDot');
const coordText = document.getElementById('coordText');
const positionInfo = document.getElementById('positionInfo');
const snapToGridCheckbox = document.getElementById('snapToGrid');

// Настройки
let isDragging = false;
let currentPosition = { x: 25, y: 25 };
const squareSize = { width: 50, height: 50 };
const gridSize = 50;
const svgBounds = {
    minX: 0,
    minY: 0,
    maxX: 1000 - squareSize.width,
    maxY: 1000 - squareSize.height
};

// Инициализация
function init() {
    // Добавляем обработчики событий для квадрата
    draggableSquare.addEventListener('mousedown', startDrag);
    draggableSquare.addEventListener('touchstart', startDragTouch);
    
    // Для всего документа чтобы отслеживать движение вне квадрата
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchmove', dragTouch);
    document.addEventListener('touchend', stopDrag);
    
    updateVisualPosition();
}

// Начало перетаскивания (мышь)
function startDrag(e) {
    e.preventDefault();
    isDragging = true;
    draggableSquare.style.cursor = 'grabbing';
    svgContainer.style.cursor = 'grabbing';
}

// Начало перетаскивания (тач)
function startDragTouch(e) {
    e.preventDefault();
    isDragging = true;
    const touch = e.touches[0];
    startDrag({ clientX: touch.clientX, clientY: touch.clientY });
}

// Перетаскивание (мышь)
function drag(e) {
    if (!isDragging) return;
    
    // Получаем координаты курсора относительно SVG
    const svgRect = svgContainer.getBoundingClientRect();
    const x = e.clientX - svgRect.left;
    const y = e.clientY - svgRect.top;
    
    updatePosition(x, y);
}

// Перетаскивание (тач)
function dragTouch(e) {
    if (!isDragging) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    drag({ clientX: touch.clientX, clientY: touch.clientY });
}

// Обновление позиции квадрата
function updatePosition(newX, newY) {
    // Вычитаем половину размера квадрата чтобы тянуть за центр
    let targetX = newX - squareSize.width / 2;
    let targetY = newY - squareSize.height / 2;
    
    // Ограничиваем границами SVG
    targetX = Math.max(svgBounds.minX, Math.min(svgBounds.maxX, targetX));
    targetY = Math.max(svgBounds.minY, Math.min(svgBounds.maxY, targetY));
    
    // Привязка к сетке если включена
    if (snapToGridCheckbox.checked) {
        targetX = Math.round(targetX / gridSize) * gridSize;
        targetY = Math.round(targetY / gridSize) * gridSize;
        
        // Гарантируем что остаемся в границах
        targetX = Math.max(svgBounds.minX, Math.min(svgBounds.maxX, targetX));
        targetY = Math.max(svgBounds.minY, Math.min(svgBounds.maxY, targetY));
    }
    
    // Обновляем позицию
    currentPosition.x = targetX;
    currentPosition.y = targetY;
    
    updateVisualPosition();
}

// Обновление визуальной позиции
function updateVisualPosition() {
    // Обновляем атрибуты SVG
    draggableSquare.setAttribute('x', currentPosition.x);
    draggableSquare.setAttribute('y', currentPosition.y);
    
    // Обновляем центральную точку
    centerDot.setAttribute('cx', currentPosition.x + squareSize.width / 2);
    centerDot.setAttribute('cy', currentPosition.y + squareSize.height / 2);
    
    // Обновляем текст с координатами
    const text = `x: ${currentPosition.x}, y: ${currentPosition.y}`;
    coordText.textContent = text;
    positionInfo.textContent = text;
    
    // Позиционируем текст рядом с квадратом
    coordText.setAttribute('x', currentPosition.x + squareSize.width + 10);
    coordText.setAttribute('y', currentPosition.y + 20);
}

// Остановка перетаскивания
function stopDrag() {
    if (!isDragging) return;
    
    isDragging = false;
    draggableSquare.style.cursor = 'move';
    svgContainer.style.cursor = 'grab';
    
    // Выводим в консоль финальную позицию
    console.log(`Square position: x=${currentPosition.x}, y=${currentPosition.y}`);
}

// Вспомогательные функции
function resetPosition() {
    currentPosition = { x: 25, y: 25 };
    updateVisualPosition();
}

function centerSquare() {
    currentPosition = { 
        x: (500 - squareSize.width) / 2, 
        y: (500 - squareSize.height) / 2 
    };
    updateVisualPosition();
}

// Инициализация при загрузке
window.addEventListener('DOMContentLoaded', init);

// Также можно двигать стрелками (опционально)
window.addEventListener('keydown', function(e) {
    if (!isDragging) {
        const moveStep = snapToGridCheckbox.checked ? gridSize : 10;
        
        switch(e.code) {
            case 'ArrowUp':
                currentPosition.y = Math.max(svgBounds.minY, currentPosition.y - moveStep);
                break;
            case 'ArrowDown':
                currentPosition.y = Math.min(svgBounds.maxY, currentPosition.y + moveStep);
                break;
            case 'ArrowLeft':
                currentPosition.x = Math.max(svgBounds.minX, currentPosition.x - moveStep);
                break;
            case 'ArrowRight':
                currentPosition.x = Math.min(svgBounds.maxX, currentPosition.x + moveStep);
                break;
            default:
                return;
        }
        updateVisualPosition();
        e.preventDefault();
    }
});