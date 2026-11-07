# Baldomera Closet

App para llevar el control de las prendas que se venden en Vinted: lo que costó cada una, cuánto tiempo lleva publicada, por cuánto se vendió, el beneficio de cada mes y qué anuncios toca renovar.

**Abrir la app:** https://californiakid91.github.io/Baldomeracloset/

## Instalarla en el iPhone
1. Abre el enlace en **Safari**.
2. Toca **Compartir** y luego **Añadir a pantalla de inicio**.
3. Ábrela siempre desde ese icono.

## Cómo funciona
- **Renovar**: al abrirla salen primero los anuncios que toca renovar (cada 3 días, se puede cambiar en Ajustes). Toca «Renovado» cuando lo hayas hecho en Vinted.
- **Armario**: todas las prendas, con filtros por estado, tipo y color.
- **Estadísticas**: qué marcas, tipos de prenda y colores se venden antes, cuáles tardan más y cuáles dejan más beneficio, para saber qué comprar en el mercadillo.
- **Cuentas**: beneficio del mes, ingresos, gastos en compras y gráfica de los últimos 6 meses.
- **Calendario** (opcional): en Ajustes se puede activar para añadir un aviso al Calendario del iPhone que se repite cada pocos días.
- **Copias** (en Ajustes, la rueda de arriba): todo se guarda solo en el iPhone. Conviene guardar una copia de seguridad de vez en cuando en Archivos o iCloud Drive. Al recuperar una copia, las prendas se añaden a las que ya haya.

## Para actualizar la app
Edita `index.html`, sube `APP_VERSION` en `index.html` y `VERSION` en `sw.js` (por ejemplo de 1 a 2) y súbelo. El iPhone recibirá la versión nueva sola.

La app se actualiza sola: cada vez que se abre (o vuelve a primer plano) comprueba si hay una versión nueva y se recarga con ella. No hace falta volver a añadirla a la pantalla de inicio.
