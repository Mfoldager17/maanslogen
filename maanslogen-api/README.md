<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

### Billeder (MinIO / S3)

Billeder uploades via **presigned URLs**: frontend henter upload-URLs fra API’et, uploader direkte til MinIO, og bruger derefter de returnerede URLs ved oprettelse af Beverage/User/Category/Type.

**Flow:**  
1. Kald presign med **context** (bucket og mappesti sættes i backend):  
   - `POST /upload/presign/beverage-images` – til beverage-billeder  
   - `POST /upload/presign/user-profile` – til brugerprofil  
   - `POST /upload/presign/category-icons` – til kategorier  
   Body: `{ "uploads": [ { "type": "THUMBNAIL" }, { "type": "LARGE" } ] }`  
2. For hver slot: **PUT** fil til `uploadUrl` (body = fil, header `Content-Type: image/jpeg` eller tilsvarende)  
3. Opret entitet (f.eks. `POST /beverages`) med `images: [ { "url": "<url fra step 1>", "type": "THUMBNAIL" }, ... ]`  

Hvis brugeren aldrig opretter entiteten, bliver uploadet stående i S3. API’et holder styr på “pending” uploads (fra presign) og fjerner dem fra listen, når du opretter beverage/user/category med de pågældende URLs (`confirmUploads`). En **cron-job** hver 12. time sletter objekter i S3 (og rækker i `PendingUpload`) for uploads, der er udløbet (15 min) og aldrig blev bekræftet – så forældreløse billeder ryger automatisk. Bucketen oprettes automatisk ved første presign, hvis den ikke findes (backend styrer context, så det er sikkert).

**Env (MinIO):**

| Variable           | Påkrævet | Beskrivelse |
|-------------------|----------|-------------|
| `MINIO_ENDPOINT`  | Ja       | Host (evt. med port), fx `localhost:9000` eller `maanslogen-images.mathiasfoldager.com` |
| `MINIO_USE_SSL`   | Ja       | `true` eller `false` |
| `MINIO_ACCESS_KEY`| Ja       | MinIO access key |
| `MINIO_SECRET_KEY`| Ja       | MinIO secret key |
| `MINIO_BUCKET`    | Nej      | Default bucket (default: `maanslogen-test`) |
| `MINIO_PUBLIC_URL`| Nej      | Public base URL til filer (ellers bruges `http(s)://MINIO_ENDPOINT/MINIO_BUCKET`) |
| `MINIO_REGION`    | Nej      | Region, fx `eu-north-1` |

**Eksempel: MinIO lokalt (port 9000):**

```env
MINIO_ENDPOINT=localhost:9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=din-access-key
MINIO_SECRET_KEY=din-secret-key
MINIO_BUCKET=maanslogen-test
```

**Eksempel: MinIO bag proxy** (fx `maanslogen-images.mathiasfoldager.com`):

```env
MINIO_ENDPOINT=maanslogen-images.mathiasfoldager.com
MINIO_USE_SSL=true
MINIO_ACCESS_KEY=din-access-key
MINIO_SECRET_KEY=din-secret-key
MINIO_BUCKET=maanslogen-images
MINIO_PUBLIC_URL=https://maanslogen-images.mathiasfoldager.com/maanslogen-images
```

Så peger API’et på MinIO via proxy-domænet, og de billed-URL’er der returneres, kan åbnes i browseren via samme domæne (så længe proxy’en serverer bucket-indholdet der).

**Good to go – checkliste**

1. **Env** – sæt `MINIO_ENDPOINT`, `MINIO_USE_SSL`, `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY` (og evt. `MINIO_BUCKET`) i `.env`.
2. **Bucket** – oprettes automatisk ved første presign, hvis den ikke findes (default fra `MINIO_BUCKET`).
3. **Database** – kør `npx prisma migrate deploy` (eller `migrate dev`) så `PendingUpload` har `bucket`.
4. **Test** – start API (`npm run start:dev`), sørg for at MinIO kører, og kør:
   ```bash
   chmod +x scripts/test-minio-upload.sh
   ./scripts/test-minio-upload.sh
   ```
   Scriptet (kræver Node.js og curl): henter beverage type → presigned URL → uploader testbillede → opretter beverage med billed-URL. Ved succes står der ✅ i slutningen.

Alternativt: brug **Swagger** på `http://localhost:3000/swagger` – test fx `POST /upload/presign/beverage-images` og `POST /beverages`. Til fil-upload til `uploadUrl`: `curl -X PUT "<uploadUrl>" -H "Content-Type: image/png" --data-binary @fil.png`.

### Admin og Swagger JSON

**Next.js-admin** ligger i `maanslogen/maanslogen-admin` og bruger denne API. Adminen genererer en typet API-klient fra OpenAPI/Swagger.

- **Swagger UI:** `http://localhost:3000/swagger`
- **Swagger JSON (til klientgenerering):** `http://localhost:3000/swagger-json`  
  I adminen: `npm run generate:api:live` (når API kører) opdaterer `src/lib/api-types.d.ts` fra dette endpoint.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
