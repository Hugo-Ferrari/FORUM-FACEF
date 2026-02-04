"""
Script para exportar a especificação OpenAPI/Swagger para arquivo
Execute: python export_swagger.py
"""

import json
import yaml
from app.main import fastapi_app

def export_openapi_json():
    """Exporta OpenAPI em formato JSON"""
    openapi_schema = fastapi_app.openapi()

    with open('openapi.json', 'w', encoding='utf-8') as f:
        json.dump(openapi_schema, f, indent=2, ensure_ascii=False)

    print("✅ OpenAPI exportado para: openapi.json")

def export_openapi_yaml():
    """Exporta OpenAPI em formato YAML"""
    openapi_schema = fastapi_app.openapi()

    with open('openapi.yaml', 'w', encoding='utf-8') as f:
        yaml.dump(openapi_schema, f, default_flow_style=False, allow_unicode=True, sort_keys=False)

    print("✅ OpenAPI exportado para: openapi.yaml")

def print_routes_summary():
    """Imprime resumo das rotas"""
    print("\n" + "="*60)
    print("📋 RESUMO DAS ROTAS DISPONÍVEIS")
    print("="*60 + "\n")

    routes = []
    for route in fastapi_app.routes:
        if hasattr(route, 'methods') and hasattr(route, 'path'):
            for method in route.methods:
                if method != "HEAD":
                    routes.append({
                        'method': method,
                        'path': route.path,
                        'name': route.name,
                        'tags': route.tags if hasattr(route, 'tags') else []
                    })

    # Agrupa por tags
    routes_by_tag = {}
    for route in sorted(routes, key=lambda x: (x['tags'][0] if x['tags'] else 'Other', x['path'])):
        tag = route['tags'][0] if route['tags'] else 'Other'
        if tag not in routes_by_tag:
            routes_by_tag[tag] = []
        routes_by_tag[tag].append(route)

    # Imprime agrupado
    for tag, tag_routes in routes_by_tag.items():
        print(f"📌 {tag}")
        print("-" * 60)
        for route in tag_routes:
            print(f"  {route['method']:7} {route['path']}")
        print()

    print("="*60)
    print(f"Total de rotas: {len(routes)}")
    print("="*60 + "\n")

if __name__ == "__main__":
    print("\n🚀 Exportando especificação OpenAPI/Swagger...\n")

    try:
        export_openapi_json()
        export_openapi_yaml()
        print_routes_summary()

        print("\n✨ Exportação concluída com sucesso!")
        print("\nPara visualizar a documentação interativa:")
        print("  1. Inicie o servidor: uvicorn app.main:app --reload")
        print("  2. Acesse: http://localhost:8000/docs (Swagger UI)")
        print("  3. Ou: http://localhost:8000/redoc (ReDoc)")

    except Exception as e:
        print(f"\n❌ Erro ao exportar: {e}")
