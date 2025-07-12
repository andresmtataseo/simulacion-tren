# Simulación Ferroviaria

Una aplicación web interactiva que simula un sistema ferroviario con vías únicas y dobles, desarrollada con HTML, Bootstrap y JavaScript.

## 🚂 Características

- **Simulación de 1,000 trenes** con tiempos aleatorios
- **Visualización en tiempo real** del movimiento de trenes
- **Control de acceso** a vía única (solo un tren a la vez)
- **Alternancia automática** entre carriles de vía doble
- **Métricas de cola** en tiempo real
- **Interfaz responsiva** con Bootstrap 5
- **Log de eventos** detallado

## 📊 Especificaciones del Sistema

### Tiempos de Procesamiento (Aleatorios)
- **Tiempo de llegada**: 10 ± 5 minutos
- **Tiempo en vía única**: 8 ± 4 minutos  
- **Tiempo en vía doble**: 18 ± 9 minutos

### Estructura del Sistema
1. **Entrada de Trenes**: Cola de espera
2. **Vía Única**: Solo un tren a la vez
3. **Vía Doble**: Dos carriles (A y B) con alternancia
4. **Salida**: Trenes completados

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **Bootstrap 5**: Framework CSS responsivo
- **JavaScript ES6+**: Lógica de simulación
- **Font Awesome**: Iconografía
- **CSS3**: Animaciones y estilos personalizados

## 📁 Estructura del Proyecto

```
simulacion-tren/
├── index.html          # Página principal
├── css/
│   └── style.css      # Estilos personalizados
├── js/
│   └── script.js      # Lógica de simulación
└── README.md          # Documentación
```

## 🚀 Cómo Usar

1. **Abrir el archivo** `index.html` en tu navegador web
2. **Hacer clic** en "Iniciar Simulación"
3. **Observar** el movimiento de trenes en tiempo real
4. **Monitorear** las métricas de cola y progreso
5. **Revisar** el log de eventos para detalles

## 📈 Métricas Mostradas

- **Trenes Completados**: Progreso de la simulación
- **Cola Actual**: Número de trenes esperando
- **Cola Máxima**: Pico histórico de la cola
- **Cola Promedio**: Promedio de trenes en cola
- **Tiempo Total**: Duración de la simulación

## 🎯 Objetivos de la Simulación

1. **Analizar** el comportamiento de colas en sistemas ferroviarios
2. **Medir** la eficiencia del control de tráfico
3. **Visualizar** el flujo de trenes en tiempo real
4. **Calcular** métricas de rendimiento del sistema

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo LICENSE para más detalles.
