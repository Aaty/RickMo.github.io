# Transporter #

## Introducción ##

El transporter (a.k.a. **nydus.php**) es un script que recibirá peticiones AJAX desde la librería javascript que se ejecutará cuando se vaya haciendo scroll en las páginas que tengan la navegación continua y que devolverá un json con el contenido necesario para mostrar el siguiente contenido relacionado al usuario.

Las peticiones enviarán el parámetro **content** (url-encondeado) via GET cuyo contenido será la url sin el dominio ni la extensión, funcionará tanto para noticia como con portadillas.

**Ej:**

Si la url es:

    http://www.elmundo.es/internacional/2015/07/14/55a4af53268e3ecc048b456e.html

El parámetro content que se enviará será:

    internacional/2015/07/14/55a4af53268e3ecc048b456e


## Instalación ##

Para instalar el proyecto, y teniendo [Phing](http://www.phing.info/) instalado (aconsajable con composer), basta con ejecutar lo siguiente:

    phing install

Lo que hará será sobreescribir el fichero *parameters.php* que hubiese con los que haya en el fichero *parameters.php.sample*, y componer el transporter final, incluyendo dichos parámetros en el fichero *dist/nydus.php*.

Se puede ver el listado de tareas que están definidas en el fichero de configuración ejecutando:

    phing -l

## Parámetros ##

+ **portal**: El nombre del portal que se utilizará para componer rutas. Ej: *elmundo*
+ **publicRootPath**: La ruta base donde están los ficheros html del portal. Ej: */mnt/filer/html/produccion/httpd/portales/es/elmundo/www*
+ **coreExtension**: Extensión del fichero que contiene únicamente el contenido del content-type (sin el marco) y que estará ubicado en el mismo path que el formato web. Ej: *_nav_content.html*
+ **jsonNavExtension**: Extensión del fichero json de navegación continua que es generado en el mismo path que los ficheros html de los contenidos. Ej: *_nav.json*
+ **dfpFileExtension**: Extensión de los ficheros dfp necesarios para la navegación continua. Ej: *_nav-cont.php*
+ **dfpRootPath**: La ruta base donde están los ficheros de publicidad de dfp. Ej: */mnt/filer/html/produccion/datos/include/dfp/elmundo/*
+ **cookieName**: El nombre de la cookie que contiene las preferencias del usuario para obtener el tipo de dispositivo. Ej: ELMUNDO_pref

## Funcionamiento ##

En resumen, los pasos que realiza el script son los siguientes:

1. Obtiene el parámetro content.
2. Lee la cookie para saber si tiene que devolver el contenido web o el mobile.
3. Según el contenido a devolver (web/mobile) leerá el fichero json que se ha pregenerado al publicarse el contenido y se guarda en una variable.
4. Se evalúa el contenido del fichero con extensión **coreExtension** ya que contiene código PHP, y el resultado se almacena en un campo de la variable anteriormente establecida.
5. Se comprueba si el contenido tiene comentarios, devolviendo los siguientes valores:
    * **-1** Si el contenido no es, ni ha sido nunca comentable.
    * **0** Si es comentable pero no ha tenido ningún comentario.
    * **n** El número de comentarios, incluso aunque luego se haya corregido y se le haya quitado la opción de comentar.

5. Se evalúan los fichero de dfp (el banner y el correspondiente al content-type de la sección correspondiente) ya que se basan en ciertas variables que no se conocen de antemano (referer, cookie) y se almacena en otro campo de la variable del punto **3**.
6. Se imprime el contenido de la variable en formato json.
