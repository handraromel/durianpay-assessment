package docs

import (
	"net/http"
	"os"
)

// SwaggerUIHTML returns an HTML page that renders Swagger UI from CDN
const swaggerUIHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>API Documentation - DurianPay</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css">
  <style>
    body { margin: 0; padding: 0; }
    #swagger-ui { max-width: 1200px; margin: 0 auto; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    SwaggerUIBundle({
      url: '/docs/openapi.yaml',
      dom_id: '#swagger-ui',
      presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIBundle.SwaggerUIStandalonePreset
      ],
      layout: "BaseLayout",
    });
  </script>
</body>
</html>`

// SwaggerUIHandler serves the Swagger UI HTML page
func SwaggerUIHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte(swaggerUIHTML))
	}
}

// OpenAPISpecHandler serves the raw OpenAPI YAML file
func OpenAPISpecHandler(yamlPath string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		data, err := os.ReadFile(yamlPath)
		if err != nil {
			http.Error(w, "OpenAPI spec not found", http.StatusNotFound)
			return
		}
		w.Header().Set("Content-Type", "application/x-yaml")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write(data)
	}
}
