// Animação para cards
document.addEventListener('DOMContentLoaded', function() {
    // Animar cards ao aparecer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observar todos os cards
    document.querySelectorAll('.feature-card, .stat-card').forEach(card => {
        observer.observe(card);
    });

    // Menu ativo
    const currentPath = window.location.pathname;
    document.querySelectorAll('nav a').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

    // Modal para auditoria
    const modalTriggers = document.querySelectorAll('[data-modal-target]');
    const modal = document.getElementById('auditModal');
    
    if (modal) {
        modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                modal.classList.add('active');
            });
        });

        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.classList.remove('active');
        });

        // Fechar modal ao clicar fora
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }

    // Gráficos (se Chart.js estiver incluído)
    initializeCharts();
});

function initializeCharts() {
    const ctx = document.getElementById('auditChart');
    if (!ctx) return;

    // Exemplo de gráfico com Chart.js
    new Chart(ctx.getContext('2d'), {
        type: 'radar',
        data: {
            labels: ['Viés', 'Transparência', 'Privacidade', 'Performance', 'Conformidade'],
            datasets: [{
                label: 'Score de Auditoria',
                data: [85, 65, 92, 78, 88],
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                borderColor: 'rgb(99, 102, 241)',
                pointBackgroundColor: 'rgb(99, 102, 241)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(99, 102, 241)'
            }]
        },
        options: {
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        backdropColor: 'transparent'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    angleLines: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#f1f5f9'
                    }
                }
            }
        }
    });
}

// Função para executar auditoria
async function runAudit(modelId) {
    const btn = event.target;
    const originalText = btn.innerHTML;
    
    btn.innerHTML = '<span class="loading-spinner"></span> Executando auditoria...';
    btn.disabled = true;

    try {
        const response = await fetch('/audit/run-audit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ model_id: modelId })
        });

        const result = await response.json();
        
        if (result.status === 'completed') {
            showNotification('Auditoria concluída com sucesso!', 'success');
            // Atualizar interface com resultados
            updateAuditResults(result);
        } else {
            showNotification('Erro na auditoria', 'error');
        }
    } catch (error) {
        console.error('Erro:', error);
        showNotification('Erro ao executar auditoria', 'error');
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

// Notificações
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    // Animação de entrada
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Fechar notificação
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto-remover após 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}