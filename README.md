<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Practica Backend Nest - Restaurant POS
## Instanacion en desarrollo
1. Renombrear el archivo .env.example a .env y asignar los valores correspondientes

2. Instalas las dependencias de desarrollo 
```
 npm install
```

3. Instanciar nuestra base de datos y client 

```bash
npx prisma db push  # Crea los documentos en mongoDB
npx prisma generate # Genera el cliente
```

## Correr el proyecto en desarrollo 
1. Ejecutar en la terminar ```npm run start:dev```