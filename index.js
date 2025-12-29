// Плавный скролл к разделам
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Мобильное меню
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        const isDisplayed = navLinks.style.display === 'flex';
        navLinks.style.display = isDisplayed ? 'none' : 'flex';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        navLinks.style.backdropFilter = 'blur(10px)';
        navLinks.style.flexDirection = 'column';
        navLinks.style.padding = '2rem';
        navLinks.style.gap = '1.5rem';
        navLinks.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
        navLinks.style.zIndex = '1001';
    });

    // Закрытие меню при клике на ссылку
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navLinks.style.display = 'none';
            }
        });
    });
}

// Закрытие меню при изменении размера окна
window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navLinks) {
        navLinks.style.display = 'flex';
        navLinks.style.position = 'static';
        navLinks.style.backgroundColor = 'transparent';
        navLinks.style.backdropFilter = 'none';
        navLinks.style.flexDirection = 'row';
        navLinks.style.padding = '0';
        navLinks.style.boxShadow = 'none';
        navLinks.style.zIndex = '1';
    } else if (navLinks) {
        navLinks.style.display = 'none';
    }
});

// Улучшенная анимация карусели
function initCarousel() {
    const carousel = document.querySelector('.carousel');
    const track = document.querySelector('.carousel-track');
    
    if (!carousel || !track) return;
    
    let speed = 0.5;
    let position = 0;
    let maxPosition = 0;
    let isPaused = false;
    let slowdownFactor = 1;
    let targetSlowdown = 1;
    let animationId = null;
    const slides = document.querySelectorAll('.carousel-slide');
    
    // Рассчитываем максимальную позицию
    const slideWidth = slides[0]?.offsetWidth || 400;
    maxPosition = -slideWidth * (slides.length / 2);
    
    function animate() {
        if (!isPaused) {
            // Плавное изменение скорости
            slowdownFactor += (targetSlowdown - slowdownFactor) * 0.1;
            
            // Обновляем позицию
            position -= speed * slowdownFactor;
            
            // Сбрасываем позицию для бесконечной прокрутки
            if (position <= maxPosition) {
                position = 0;
            }
            
            // Применяем трансформацию
            track.style.transform = `translateX(${position}px)`;
        }
        
        // Запрашиваем следующий кадр
        animationId = requestAnimationFrame(animate);
    }
    
    // Адаптация к размеру окна
    window.addEventListener('resize', () => {
        const slideWidth = slides[0]?.offsetWidth || 400;
        maxPosition = -slideWidth * (slides.length / 2);
    });
    // Запуск анимации
    animate();
    
    // Возвращаем функцию для очистки
    return () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    };
}

// Инициализация при загрузке страницы
let cleanupCarousel = null;

document.addEventListener('DOMContentLoaded', () => {
    // Инициализация карусели только если она есть на странице
    if (document.querySelector('.carousel')) {
        cleanupCarousel = initCarousel();
    }
    
    // Анимация для header при скролле
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.style.padding = '1rem 0';
            header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.padding = '1.5rem 0';
            header.style.boxShadow = 'none';
        }
    });
});

// Очистка при разгрузке страницы
window.addEventListener('beforeunload', () => {
    if (cleanupCarousel) {
        cleanupCarousel();
    }
});