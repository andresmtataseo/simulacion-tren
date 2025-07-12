/**
 * Simulación Ferroviaria
 * Sistema de vías únicas y dobles con control de tráfico
 * 
 * Autor: Sistema de Simulación Ferroviaria
 * Versión: 1.0
 */

// Clase principal de la simulación
class RailwaySimulation {
    constructor() {
        // Configuración de la simulación
        this.totalTrains = 1000;
        this.completedTrains = 0;
        this.currentTime = 0;
        this.isRunning = false;
        
        // Estados del sistema ferroviario
        this.entryTrains = [];
        this.singleTrackTrain = null;
        this.doubleTrackA = [];
        this.doubleTrackB = [];
        this.exitTrains = [];
        
        // Métricas de cola
        this.queueHistory = [];
        this.maxQueueSize = 0;
        this.currentQueueSize = 0;
        
        // Control de alternancia para vía doble
        this.nextDoubleTrack = 'A';
        
        // Eventos pendientes
        this.eventQueue = [];
        
        // Control de avance rápido
        this.fastForwardMode = false;
        this.fastForwardInterval = null;
        
        // Referencias a elementos DOM
        this.initializeDOMElements();
        
        // Configurar event listeners
        this.setupEventListeners();
        
        // Inicializar interfaz
        this.updateInterface();
    }
    
    /**
     * Inicializa las referencias a elementos DOM
     */
    initializeDOMElements() {
        this.elements = {
            startButton: document.getElementById('startSimulation'),
            fastForwardButton: document.getElementById('fastForward'),
            completedTrains: document.getElementById('completedTrains'),
            totalTrains: document.getElementById('totalTrains'),
            progressBar: document.getElementById('progressBar'),
            currentQueue: document.getElementById('currentQueue'),
            maxQueue: document.getElementById('maxQueue'),
            entryCount: document.getElementById('entryCount'),
            singleTrackCount: document.getElementById('singleTrackCount'),
            doubleTrackCount: document.getElementById('doubleTrackCount'),
            exitCount: document.getElementById('exitCount'),
            entryTrains: document.getElementById('entryTrains'),
            singleTrackTrains: document.getElementById('singleTrackTrains'),
            doubleTrackA: document.getElementById('doubleTrackA'),
            doubleTrackB: document.getElementById('doubleTrackB'),
            exitTrains: document.getElementById('exitTrains'),
            maxQueueResult: document.getElementById('maxQueueResult'),
            avgQueueResult: document.getElementById('avgQueueResult'),
            totalTimeResult: document.getElementById('totalTimeResult'),
            eventLog: document.getElementById('eventLog')
        };
    }
    
    /**
     * Configura los event listeners
     */
    setupEventListeners() {
        this.elements.startButton.addEventListener('click', () => {
            if (!this.isRunning) {
                this.startSimulation();
            } else {
                this.stopSimulation();
            }
        });
        
        this.elements.fastForwardButton.addEventListener('click', () => {
            this.fastForwardSimulation();
        });
    }
    
    /**
     * Inicia la simulación
     */
    startSimulation() {
        if (this.isRunning) return;
        
        // Resetear simulación
        this.resetSimulation();
        
        this.isRunning = true;
        this.elements.startButton.innerHTML = '<i class="fas fa-stop me-2"></i>Detener Simulación';
        this.elements.startButton.classList.remove('btn-success');
        this.elements.startButton.classList.add('btn-danger');
        this.elements.fastForwardButton.disabled = false;
        document.body.classList.add('simulation-running');
        
        this.logEvent('Simulación iniciada', 'info');
        
        // Generar el primer tren
        this.generateNextTrain();
        
        // Iniciar el bucle de simulación
        this.simulationLoop();
    }
    
    /**
     * Resetea la simulación
     */
    resetSimulation() {
        this.completedTrains = 0;
        this.currentTime = 0;
        this.entryTrains = [];
        this.singleTrackTrain = null;
        this.doubleTrackA = [];
        this.doubleTrackB = [];
        this.exitTrains = [];
        this.queueHistory = [];
        this.maxQueueSize = 0;
        this.currentQueueSize = 0;
        this.nextDoubleTrack = 'A';
        this.eventQueue = [];
        
        // Resetear modo avance rápido
        this.fastForwardMode = false;
        if (this.fastForwardInterval) {
            clearInterval(this.fastForwardInterval);
            this.fastForwardInterval = null;
        }
        
        // Limpiar log
        this.elements.eventLog.innerHTML = '<p class="text-muted">Los eventos de la simulación aparecerán aquí...</p>';
        
        // Resetear resultados
        this.elements.maxQueueResult.textContent = '-';
        this.elements.avgQueueResult.textContent = '-';
        this.elements.totalTimeResult.textContent = '-';
    }
    
    /**
     * Detiene la simulación
     */
    stopSimulation() {
        this.isRunning = false;
        this.fastForwardMode = false;
        if (this.fastForwardInterval) {
            clearInterval(this.fastForwardInterval);
            this.fastForwardInterval = null;
        }
        
        this.elements.startButton.innerHTML = '<i class="fas fa-play me-2"></i>Iniciar Simulación';
        this.elements.startButton.classList.remove('btn-danger');
        this.elements.startButton.classList.add('btn-success');
        this.elements.fastForwardButton.disabled = true;
        this.elements.fastForwardButton.innerHTML = '<i class="fas fa-forward me-2"></i>Avance Rápido';
        this.elements.fastForwardButton.classList.remove('btn-info');
        this.elements.fastForwardButton.classList.add('btn-warning');
        document.body.classList.remove('simulation-running');
        
        this.logEvent('Simulación detenida', 'warning');
    }
    
    /**
     * Bucle principal de la simulación
     */
    simulationLoop() {
        if (!this.isRunning) return;
        
        // Procesar eventos pendientes
        this.processEvents();
        
        // Actualizar interfaz
        this.updateInterface();
        
        // Continuar el bucle solo si hay eventos pendientes o trenes en el sistema
        if (this.eventQueue.length > 0 || this.hasActiveTrains()) {
            setTimeout(() => {
                this.simulationLoop();
            }, 100); // Actualizar cada 100ms para visualización fluida
        } else {
            // Si no hay eventos pendientes y no hay trenes activos, terminar
            this.finishSimulation();
        }
    }
    
    /**
     * Verifica si hay trenes activos en el sistema
     */
    hasActiveTrains() {
        return this.entryTrains.length > 0 || 
               this.singleTrackTrain !== null || 
               this.doubleTrackA.length > 0 || 
               this.doubleTrackB.length > 0;
    }
    
    /**
     * Activa el modo de avance rápido para terminar la simulación rápidamente
     */
    fastForwardSimulation() {
        if (!this.isRunning) return;
        
        if (!this.fastForwardMode) {
            // Activar modo avance rápido
            this.fastForwardMode = true;
            this.elements.fastForwardButton.innerHTML = '<i class="fas fa-pause me-2"></i>Pausar Avance';
            this.elements.fastForwardButton.classList.remove('btn-warning');
            this.elements.fastForwardButton.classList.add('btn-info');
            
            this.logEvent('Avance rápido activado', 'warning');
            
            // Iniciar bucle de avance rápido
            this.fastForwardInterval = setInterval(() => {
                if (this.isRunning && this.fastForwardMode) {
                    // Procesar múltiples eventos rápidamente
                    for (let i = 0; i < 10; i++) {
                        this.processEvents();
                    }
                    this.updateInterface();
                    
                    // Verificar si la simulación ha terminado
                    if (this.completedTrains >= this.totalTrains) {
                        this.finishSimulation();
                        return;
                    }
                } else {
                    clearInterval(this.fastForwardInterval);
                    this.fastForwardInterval = null;
                }
            }, 50); // Actualizar cada 50ms para mayor velocidad
        } else {
            // Desactivar modo avance rápido
            this.fastForwardMode = false;
            this.elements.fastForwardButton.innerHTML = '<i class="fas fa-forward me-2"></i>Avance Rápido';
            this.elements.fastForwardButton.classList.remove('btn-info');
            this.elements.fastForwardButton.classList.add('btn-warning');
            
            if (this.fastForwardInterval) {
                clearInterval(this.fastForwardInterval);
                this.fastForwardInterval = null;
            }
            
            this.logEvent('Avance rápido desactivado', 'info');
            
            // Volver al bucle normal
            this.simulationLoop();
        }
    }
    
    /**
     * Genera el siguiente tren con tiempos aleatorios
     */
    generateNextTrain() {
        if (this.completedTrains >= this.totalTrains) {
            return;
        }
        
        // Generar tiempos aleatorios según las especificaciones
        const arrivalTime = this.generateRandomTime(10, 5); // 10 ± 5 minutos
        const singleTrackTime = this.generateRandomTime(8, 4);  // 8 ± 4 minutos
        const doubleTrackTime = this.generateRandomTime(18, 9); // 18 ± 9 minutos
        
        const train = {
            id: this.completedTrains + 1,
            arrivalTime: this.currentTime + arrivalTime,
            singleTrackTime: singleTrackTime,
            doubleTrackTime: doubleTrackTime,
            state: 'waiting', // waiting, entry, single-track, double-track, exit
            currentSection: 'entry',
            timeInCurrentSection: 0,
            totalTime: 0
        };
        
        // Programar llegada del tren
        this.scheduleEvent(train.arrivalTime, () => {
            this.trainArrives(train);
        });
        
        this.logEvent(`Tren ${train.id} programado para llegar en ${arrivalTime.toFixed(1)} minutos`, 'info');
    }
    
    /**
     * Genera un tiempo aleatorio dentro del rango especificado
     * @param {number} base - Tiempo base en minutos
     * @param {number} variation - Variación en minutos
     * @returns {number} Tiempo aleatorio en minutos
     */
    generateRandomTime(base, variation) {
        return Math.max(1, base + (Math.random() - 0.5) * 2 * variation);
    }
    
    /**
     * Programa un evento para ejecutarse en el futuro
     * @param {number} executionTime - Tiempo de ejecución absoluto
     * @param {Function} callback - Función a ejecutar
     */
    scheduleEvent(executionTime, callback) {
        this.eventQueue.push({
            time: executionTime,
            callback: callback
        });
        
        // Ordenar eventos por tiempo de ejecución
        this.eventQueue.sort((a, b) => a.time - b.time);
    }
    
    /**
     * Procesa todos los eventos pendientes
     */
    processEvents() {
        const currentEvents = this.eventQueue.filter(event => event.time <= this.currentTime);
        
        for (const event of currentEvents) {
            event.callback();
        }
        
        // Remover eventos procesados
        this.eventQueue = this.eventQueue.filter(event => event.time > this.currentTime);
        
        // Avanzar tiempo al siguiente evento si existe
        if (this.eventQueue.length > 0) {
            this.currentTime = this.eventQueue[0].time;
        } else if (this.isRunning && this.hasActiveTrains()) {
            // Si no hay eventos pero hay trenes activos, avanzar tiempo gradualmente
            this.currentTime += 0.1;
        }
    }
    
    /**
     * Maneja la llegada de un tren al sistema
     * @param {Object} train - Tren que llega
     */
    trainArrives(train) {
        train.state = 'entry';
        train.currentSection = 'entry';
        train.timeInCurrentSection = 0;
        this.entryTrains.push(train);
        
        this.logEvent(`Tren ${train.id} llega al sistema`, 'success');
        
        // Intentar mover el tren a la vía única
        this.tryMoveToSingleTrack();
        
        // Generar el siguiente tren si no hemos alcanzado el límite
        if (this.completedTrains + this.entryTrains.length + 
            (this.singleTrackTrain ? 1 : 0) + 
            this.doubleTrackA.length + this.doubleTrackB.length < this.totalTrains) {
            this.generateNextTrain();
        }
    }
    
    /**
     * Intenta mover un tren de la entrada a la vía única
     */
    tryMoveToSingleTrack() {
        if (this.singleTrackTrain !== null || this.entryTrains.length === 0) {
            return;
        }
        
        const train = this.entryTrains.shift();
        train.state = 'single-track';
        train.currentSection = 'single-track';
        train.timeInCurrentSection = 0;
        this.singleTrackTrain = train;
        
        this.logEvent(`Tren ${train.id} entra a la vía única`, 'warning');
        
        // Programar salida de la vía única
        this.scheduleEvent(this.currentTime + train.singleTrackTime, () => {
            this.trainLeavesSingleTrack(train);
        });
    }
    
    /**
     * Maneja la salida de un tren de la vía única
     * @param {Object} train - Tren que sale de la vía única
     */
    trainLeavesSingleTrack(train) {
        this.singleTrackTrain = null;
        
        // Decidir a qué vía doble enviar el tren
        const targetTrack = this.nextDoubleTrack;
        this.nextDoubleTrack = this.nextDoubleTrack === 'A' ? 'B' : 'A';
        
        train.state = 'double-track';
        train.currentSection = `double-track-${targetTrack.toLowerCase()}`;
        train.timeInCurrentSection = 0;
        
        if (targetTrack === 'A') {
            this.doubleTrackA.push(train);
        } else {
            this.doubleTrackB.push(train);
        }
        
        this.logEvent(`Tren ${train.id} sale de vía única hacia carril ${targetTrack}`, 'info');
        
        // Programar salida de la vía doble
        this.scheduleEvent(this.currentTime + train.doubleTrackTime, () => {
            this.trainLeavesDoubleTrack(train, targetTrack);
        });
        
        // Intentar mover el siguiente tren a la vía única
        this.tryMoveToSingleTrack();
    }
    
    /**
     * Maneja la salida de un tren de la vía doble
     * @param {Object} train - Tren que sale de la vía doble
     * @param {string} track - Carril de donde sale (A o B)
     */
    trainLeavesDoubleTrack(train, track) {
        if (track === 'A') {
            this.doubleTrackA = this.doubleTrackA.filter(t => t.id !== train.id);
        } else {
            this.doubleTrackB = this.doubleTrackB.filter(t => t.id !== train.id);
        }
        
        train.state = 'exit';
        train.currentSection = 'exit';
        train.timeInCurrentSection = 0;
        train.totalTime = this.currentTime - train.arrivalTime + train.singleTrackTime + train.doubleTrackTime;
        this.exitTrains.push(train);
        this.completedTrains++;
        
        this.logEvent(`Tren ${train.id} completa su recorrido (${train.totalTime.toFixed(1)} min)`, 'success');
        
        // Verificar si la simulación ha terminado
        if (this.completedTrains >= this.totalTrains) {
            this.finishSimulation();
        }
    }
    
    /**
     * Finaliza la simulación y muestra resultados
     */
    finishSimulation() {
        this.isRunning = false;
        this.fastForwardMode = false;
        if (this.fastForwardInterval) {
            clearInterval(this.fastForwardInterval);
            this.fastForwardInterval = null;
        }
        
        this.elements.startButton.innerHTML = '<i class="fas fa-play me-2"></i>Iniciar Simulación';
        this.elements.startButton.classList.remove('btn-danger');
        this.elements.startButton.classList.add('btn-success');
        this.elements.fastForwardButton.disabled = true;
        this.elements.fastForwardButton.innerHTML = '<i class="fas fa-forward me-2"></i>Avance Rápido';
        this.elements.fastForwardButton.classList.remove('btn-info');
        this.elements.fastForwardButton.classList.add('btn-warning');
        document.body.classList.remove('simulation-running');
        
        // Calcular métricas finales
        const avgQueueSize = this.queueHistory.length > 0 
            ? this.queueHistory.reduce((sum, size) => sum + size, 0) / this.queueHistory.length 
            : 0;
        
        // Mostrar resultados
        this.elements.maxQueueResult.textContent = this.maxQueueSize;
        this.elements.avgQueueResult.textContent = avgQueueSize.toFixed(1);
        this.elements.totalTimeResult.textContent = `${this.currentTime.toFixed(1)} min`;
        
        this.logEvent(`Simulación completada. ${this.completedTrains} trenes procesados en ${this.currentTime.toFixed(1)} minutos`, 'success');
        this.logEvent(`Cola máxima: ${this.maxQueueSize} trenes, Cola promedio: ${avgQueueSize.toFixed(1)} trenes`, 'info');
    }
    
    /**
     * Actualiza la interfaz de usuario
     */
    updateInterface() {
        // Actualizar contadores
        this.elements.completedTrains.textContent = this.completedTrains;
        this.elements.totalTrains.textContent = this.totalTrains;
        
        // Actualizar barra de progreso
        const progress = (this.completedTrains / this.totalTrains) * 100;
        this.elements.progressBar.style.width = `${progress}%`;
        
        // Actualizar contadores de secciones
        this.elements.entryCount.textContent = this.entryTrains.length;
        this.elements.singleTrackCount.textContent = this.singleTrackTrain ? 1 : 0;
        this.elements.doubleTrackCount.textContent = this.doubleTrackA.length + this.doubleTrackB.length;
        this.elements.exitCount.textContent = this.exitTrains.length;
        
        // Actualizar métricas de cola
        this.currentQueueSize = this.entryTrains.length;
        this.elements.currentQueue.textContent = this.currentQueueSize;
        this.elements.maxQueue.textContent = this.maxQueueSize;
        
        // Actualizar historial de cola
        this.queueHistory.push(this.currentQueueSize);
        if (this.currentQueueSize > this.maxQueueSize) {
            this.maxQueueSize = this.currentQueueSize;
        }
        
        // Actualizar visualización de trenes
        this.updateTrainVisualization();
    }
    
    /**
     * Actualiza la visualización de los trenes en cada sección
     */
    updateTrainVisualization() {
        // Limpiar contenedores
        this.elements.entryTrains.innerHTML = '';
        this.elements.singleTrackTrains.innerHTML = '';
        this.elements.doubleTrackA.innerHTML = '';
        this.elements.doubleTrackB.innerHTML = '';
        this.elements.exitTrains.innerHTML = '';
        
        // Agregar indicador de vía única si no hay tren
        if (!this.singleTrackTrain) {
            this.elements.singleTrackTrains.innerHTML = `
                <div class="single-track-indicator">
                    <i class="fas fa-exclamation-triangle text-warning"></i>
                    Solo un tren a la vez
                </div>
            `;
        }
        
        // Renderizar trenes en entrada
        this.entryTrains.forEach(train => {
            const trainElement = this.createTrainElement(train, 'entry');
            this.elements.entryTrains.appendChild(trainElement);
        });
        
        // Renderizar tren en vía única
        if (this.singleTrackTrain) {
            const trainElement = this.createTrainElement(this.singleTrackTrain, 'single-track');
            this.elements.singleTrackTrains.appendChild(trainElement);
        }
        
        // Renderizar trenes en vía doble A
        this.doubleTrackA.forEach(train => {
            const trainElement = this.createTrainElement(train, 'double-track-a');
            this.elements.doubleTrackA.appendChild(trainElement);
        });
        
        // Renderizar trenes en vía doble B
        this.doubleTrackB.forEach(train => {
            const trainElement = this.createTrainElement(train, 'double-track-b');
            this.elements.doubleTrackB.appendChild(trainElement);
        });
        
        // Renderizar trenes en salida (mostrar solo los últimos 10)
        const recentExitTrains = this.exitTrains.slice(-10);
        recentExitTrains.forEach(train => {
            const trainElement = this.createTrainElement(train, 'exit');
            this.elements.exitTrains.appendChild(trainElement);
        });
    }
    
    /**
     * Crea un elemento visual para un tren
     * @param {Object} train - Tren a renderizar
     * @param {string} section - Sección donde se encuentra
     * @returns {HTMLElement} Elemento DOM del tren
     */
    createTrainElement(train, section) {
        const trainElement = document.createElement('div');
        trainElement.className = `train ${section}`;
        trainElement.textContent = train.id;
        trainElement.title = `Tren ${train.id} - ${section}`;
        
        return trainElement;
    }
    
    /**
     * Registra un evento en el log
     * @param {string} message - Mensaje del evento
     * @param {string} type - Tipo de evento (success, warning, info, danger)
     */
    logEvent(message, type = 'info') {
        const eventElement = document.createElement('div');
        eventElement.className = `event-item ${type}`;
        eventElement.innerHTML = `
            <strong>${this.currentTime.toFixed(1)} min:</strong> ${message}
        `;
        
        this.elements.eventLog.appendChild(eventElement);
        
        // Mantener solo los últimos 50 eventos
        const events = this.elements.eventLog.querySelectorAll('.event-item');
        if (events.length > 50) {
            events[0].remove();
        }
        
        // Auto-scroll al final
        this.elements.eventLog.scrollTop = this.elements.eventLog.scrollHeight;
    }
}

// Inicializar la simulación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const simulation = new RailwaySimulation();
    
    // Hacer la simulación disponible globalmente para debugging
    window.railwaySimulation = simulation;
}); 