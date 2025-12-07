# 图片代理API使用说明

## 为什么需要图片代理？

浏览器的**同源策略（CORS）**限制了前端JavaScript直接访问其他域名的资源。当尝试在`<img>`标签中加载外部图片时，如果目标服务器没有设置正确的CORS头，浏览器会阻止请求。

**解决方案：后端代理**
- 后端服务器不受CORS限制
- 后端可以访问任何公开的URL
- 后端将图片数据转发给前端
- 前端通过同源API（`/api/image-proxy`）获取图片，避免了CORS问题

## API接口

### 1. `/api/image-proxy`

**功能：** 代理外部图片，解决CORS问题

**请求方式：** GET

**参数：**
- `url` (query参数): 目标图片的完整URL

**示例：**
```
GET /api/image-proxy?url=https://example.com/wine.jpg
```

**响应：**
- 成功：返回图片二进制数据，Content-Type为图片类型（image/jpeg, image/png等）
- 失败：
  - 400: 缺少url参数或URL格式无效
  - 403: 域名不在白名单中
  - 502: 无法获取目标图片

**白名单配置：**
在 `app/api/image-proxy/route.ts` 中的 `ALLOWED_DOMAINS` 数组添加允许的域名。

### 2. `/api/image-meta`

**功能：** 获取图片的元数据信息

**请求方式：** GET

**参数：**
- `url` (query参数): 目标图片的完整URL

**示例：**
```
GET /api/image-meta?url=https://example.com/wine.jpg
```

**响应：**
```json
{
  "width": 800,
  "height": 1200,
  "format": "jpeg",
  "size": 245760,
  "hasAlpha": false,
  "channels": 3,
  "density": 72
}
```

**字段说明：**
- `width`: 图片宽度（像素）
- `height`: 图片高度（像素）
- `format`: 图片格式（jpeg, png, webp等）
- `size`: 文件大小（字节）
- `hasAlpha`: 是否有透明通道
- `channels`: 颜色通道数
- `density`: 分辨率（DPI）

## 前端使用示例

### React组件示例

```tsx
import { useState } from 'react';

function ImageViewer() {
  const [imageUrl, setImageUrl] = useState('');
  const [proxyUrl, setProxyUrl] = useState('');

  const loadImage = () => {
    // 使用代理API
    const proxy = `/api/image-proxy?url=${encodeURIComponent(imageUrl)}`;
    setProxyUrl(proxy);
  };

  return (
    <div>
      <input 
        value={imageUrl} 
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="输入图片URL"
      />
      <button onClick={loadImage}>加载</button>
      {proxyUrl && <img src={proxyUrl} alt="Proxied" />}
    </div>
  );
}
```

### 在WineDetailModern组件中的使用

组件已自动集成代理功能：
- 如果图片URL是外部链接（http/https），自动使用代理API
- 如果是相对路径或data URI，直接使用

## 安全考虑

1. **白名单验证**：只允许特定域名的图片请求
2. **协议限制**：只允许http和https协议
3. **Content-Type验证**：确保返回的是图片类型
4. **错误处理**：妥善处理各种错误情况

## 性能优化

1. **缓存头**：设置了长期缓存（1年）
2. **流式传输**：直接转发图片数据，不进行额外处理
3. **元数据缓存**：元数据API设置了1小时缓存

## 添加新域名到白名单

在 `app/api/image-proxy/route.ts` 和 `app/api/image-meta/route.ts` 中：

```typescript
const ALLOWED_DOMAINS = [
  'moevenpick-wein.de',
  'your-new-domain.com', // 添加这里
  // ...
];
```

## 测试

可以使用 `ImageProxyDemo` 组件进行测试：
1. 在任意页面引入 `<ImageProxyDemo />`
2. 输入图片URL
3. 查看图片和元数据

