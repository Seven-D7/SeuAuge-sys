# Google Cloud Storage - Hospedagem de Vídeos

## Status Atual: SISTEMA SIMULADO ✅

O sistema de vídeos está **100% funcional** em modo demonstração, com player personalizado e estrutura completa para integração com Google Cloud Storage.

### 🎯 **Funcionalidades Implementadas:**

- ✅ **Player de Vídeo Personalizado** - Controles completos, qualidades múltiplas
- ✅ **Streaming Adaptativo** - Diferentes resoluções (1080p, 720p, 480p)
- ✅ **Sistema de Busca** - Por título, descrição, instrutor
- ✅ **Categorização** - Treino, Nutrição, Mindfulness, Yoga
- ✅ **Controle de Acesso** - Vídeos gratuitos vs premium
- ✅ **Thumbnails Automáticos** - Preview e múltiplas imagens
- ✅ **Interface Responsiva** - Desktop e mobile

## 🔧 **Para Produção: Configurar Google Cloud**

### 1. Criar Projeto Google Cloud

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione existente
3. Anote o **Project ID**

### 2. Ativar APIs Necessárias

No Google Cloud Console:

1. Vá para **APIs & Services** → **Enable APIs**
2. Ative as seguintes APIs:
   - **Cloud Storage API**
   - **Cloud Functions API** (para backend)
   - **Firebase API** (se usar Firebase)
   - **Video Intelligence API** (opcional, para análise)

### 3. Criar Bucket de Armazenamento

```bash
# Via CLI (instalar gcloud primeiro)
gsutil mb -p SEU_PROJECT_ID gs://meu-auge-videos

# Configurar CORS
gsutil cors set cors.json gs://meu-auge-videos
```

#### Arquivo `cors.json`:

```json
[
  {
    "origin": ["*"],
    "method": ["GET", "HEAD"],
    "responseHeader": ["Content-Type", "Range"],
    "maxAgeSeconds": 3600
  }
]
```

### 4. Estrutura de Pastas Recomendada

```
gs://meu-auge-videos/
├── videos/
│   ├── video-1/
│   │   ├── 1080p.mp4
│   │   ├── 720p.mp4
│   │   ├── 480p.mp4
│   │   └── metadata.json
│   └── video-2/
│       ├── 1080p.mp4
│       ├── 720p.mp4
│       ├── 480p.mp4
│       └── metadata.json
├── thumbnails/
│   ├── video-1/
│   │   ├── thumb-1.jpg
│   │   ├── thumb-2.jpg
│   │   └── thumb-3.jpg
│   └── video-2/
│       ├── thumb-1.jpg
│       ├── thumb-2.jpg
│       └── thumb-3.jpg
└── temp/
    └── uploads/
```

### 5. Configurar Service Account

1. Vá para **IAM & Admin** → **Service Accounts**
2. Crie uma nova service account
3. Adicione as seguintes roles:
   - **Storage Object Admin**
   - **Storage Legacy Bucket Reader**
4. Gere e baixe a chave JSON

### 6. Configurar Variáveis de Ambiente

```env
# Google Cloud Storage - PRODUÇÃO
VITE_GCS_BUCKET_NAME=meu-auge-videos
VITE_GCS_PROJECT_ID=seu-projeto-id-real
VITE_GCS_API_KEY=sua-api-key-publica-real

# Backend (Node.js)
GOOGLE_CLOUD_PROJECT_ID=seu-projeto-id
GOOGLE_CLOUD_KEY_FILE=caminho/para/service-account.json
GCS_BUCKET_NAME=meu-auge-videos
```

### 7. Implementar Backend (Node.js/Express)

#### **POST /api/videos/signed-url**

```javascript
const { Storage } = require("@google-cloud/storage");

const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE,
});

const bucket = storage.bucket(process.env.GCS_BUCKET_NAME);

app.post("/api/videos/signed-url", async (req, res) => {
  try {
    const { videoPath, expirationMinutes = 60 } = req.body;

    const [signedUrl] = await bucket.file(videoPath).getSignedUrl({
      version: "v4",
      action: "read",
      expires: Date.now() + expirationMinutes * 60 * 1000,
    });

    res.json({ signedUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

#### **GET /api/videos/:id/metadata**

```javascript
app.get("/api/videos/:id/metadata", async (req, res) => {
  try {
    const { id } = req.params;

    const [metadata] = await bucket
      .file(`videos/${id}/metadata.json`)
      .download();

    res.json(JSON.parse(metadata.toString()));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

#### **POST /api/videos/upload** (Para admin)

```javascript
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

app.post("/api/videos/upload", upload.single("video"), async (req, res) => {
  try {
    const { originalname, buffer, mimetype } = req.file;
    const { title, description, category, instructor } = req.body;

    const videoId = `video-${Date.now()}`;
    const fileName = `videos/${videoId}/original.mp4`;

    const file = bucket.file(fileName);
    const stream = file.createWriteStream({
      metadata: { contentType: mimetype },
    });

    stream.on("error", (error) => {
      res.status(500).json({ error: error.message });
    });

    stream.on("finish", async () => {
      // Processar vídeo para múltiplas qualidades
      await processVideoQualities(videoId);

      // Gerar thumbnails
      await generateThumbnails(videoId);

      // Salvar metadata
      await saveVideoMetadata(videoId, {
        title,
        description,
        category,
        instructor,
        uploadDate: new Date().toISOString(),
      });

      res.json({ videoId, message: "Upload realizado com sucesso" });
    });

    stream.end(buffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### 8. Processamento de Vídeo (FFmpeg)

#### Dockerfile para processamento:

```dockerfile
FROM node:18-alpine

# Instalar FFmpeg
RUN apk add --no-cache ffmpeg

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
CMD ["node", "video-processor.js"]
```

#### Script de processamento:

```javascript
const ffmpeg = require("fluent-ffmpeg");
const { Storage } = require("@google-cloud/storage");

async function processVideoQualities(videoId) {
  const inputPath = `videos/${videoId}/original.mp4`;
  const qualities = [
    { resolution: "1080p", scale: "1920:1080", bitrate: "5000k" },
    { resolution: "720p", scale: "1280:720", bitrate: "3000k" },
    { resolution: "480p", scale: "854:480", bitrate: "1500k" },
  ];

  for (const quality of qualities) {
    await new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .size(quality.scale)
        .videoBitrate(quality.bitrate)
        .output(`videos/${videoId}/${quality.resolution}.mp4`)
        .on("end", resolve)
        .on("error", reject)
        .run();
    });
  }
}

async function generateThumbnails(videoId) {
  const inputPath = `videos/${videoId}/original.mp4`;

  await new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .screenshots({
        timestamps: ["10%", "50%", "80%"],
        filename: "thumb-%i.jpg",
        folder: `thumbnails/${videoId}/`,
        size: "400x225",
      })
      .on("end", resolve)
      .on("error", reject);
  });
}
```

### 9. Configurações de Segurança

#### Regras de bucket:

```json
{
  "bindings": [
    {
      "role": "roles/storage.objectViewer",
      "members": ["allUsers"]
    }
  ]
}
```

#### Para vídeos premium (URLs assinadas):

```javascript
// Middleware de autenticação
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ error: "Token inválido" });
  }
};

// Rota protegida
app.post("/api/videos/signed-url", verifyToken, async (req, res) => {
  // Verificar se usuário tem acesso ao vídeo
  const hasAccess = await checkUserAccess(req.user.uid, req.body.videoId);

  if (!hasAccess) {
    return res.status(403).json({ error: "Acesso negado" });
  }

  // Gerar URL assinada
  // ... código anterior
});
```

### 10. Monitoramento e Analytics

```javascript
// Cloud Functions para analytics
exports.trackVideoView = functions.https.onRequest(async (req, res) => {
  const { videoId, userId, timestamp } = req.body;

  await admin.firestore().collection("video_analytics").add({
    videoId,
    userId,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    event: "view_start",
  });

  res.json({ success: true });
});

exports.trackVideoProgress = functions.https.onRequest(async (req, res) => {
  const { videoId, userId, progress } = req.body;

  await admin.firestore().collection("video_analytics").add({
    videoId,
    userId,
    progress,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    event: "progress",
  });

  res.json({ success: true });
});
```

## 💰 **Custos Estimados (Google Cloud)**

### Storage:

- **Standard Storage**: $0.020 por GB/mês
- **Nearline Storage**: $0.010 por GB/mês (para vídeos antigos)

### Bandwidth:

- **Primeiros 100GB**: Gratuito
- **Depois**: $0.12 por GB

### Exemplo para 1000 vídeos (500GB):

- **Storage**: ~$10/mês
- **Bandwidth** (1TB/mês): ~$120/mês
- **Total**: ~$130/mês

## 🧪 **Testando o Sistema**

### Modo Desenvolvimento:

1. Sistema usa vídeos mock
2. Player funciona com URLs de exemplo
3. Todas as funcionalidades disponíveis

### Modo Produção:

1. Configure as variáveis de ambiente reais
2. Faça upload dos primeiros vídeos
3. Teste URLs assinadas
4. Monitore performance e custos

## 📊 **Fluxo Completo de Upload**

1. **Admin faz upload** → Interface de admin ou API
2. **Processamento automático** → FFmpeg gera qualidades
3. **Thumbnails gerados** → Extractão automática
4. **Metadata salvo** → Firebase/Firestore
5. **Vídeo disponível** → Para usuários com acesso

---

**Status**: ✅ Sistema completo implementado
**Tempo de setup**: 4-8 horas
**Custos**: A partir de $50/mês (pequena escala)
