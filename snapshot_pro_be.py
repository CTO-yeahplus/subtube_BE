'''
### 💡 주요 변경점 및 효과

1.  **Deep AST Parsing (`analyze_python_ast_deep`)**:
    * **API Route 인식:** `@app.get("/items")` 같은 데코레이터를 분석하여 `⚡ [GET /items]` 형태로 요약합니다. 이제 AI는 코드를 다 읽지 않아도 **"이 파일은 컨트롤러구나"**라고 즉시 파악합니다.
    * **Pydantic 모델 식별:** `class User(BaseModel)`을 찾아내어 `📦 Class: User (Schema)`로 표기합니다. 데이터 구조 파악이 빨라집니다.
    * **Docstring 추출:** 함수/클래스의 주석 첫 줄을 가져옵니다. 함수의 이름만으로는 알 수 없는 **구체적인 역할**을 AI에게 전달합니다.

2.  **Tech Stack 자동 감지:**
    * 파일 내 `import` 구문을 스캔하여 `FastAPI`, `Supabase`, `OpenAI` 등이 사용되었음을 요약에 명시합니다. AI가 답변할 때 해당 라이브러리 문법을 우선적으로 고려하게 됩니다.

3.  **명시적 AI 지침 (System Prompt Embed):**
    * Markdown 최상단에 `> 🛑 INSTRUCTION FOR AI` 섹션을 추가했습니다.
    * "Context Summary를 먼저 읽고, 스키마와 엔드포인트 간의 관계를 파악하라"는 지시를 통해 할루시네이션을 줄이고 답변의 정확도를 높였습니다.

이제 이 스크립트를 실행하면 `SNAPSHOT_PRO_BE.md`는 단순한 백업 파일이 아니라, **AI가 읽기 최적화된 프로젝트 기술 명세서**가 됩니다.
'''

import os
import datetime
import re
import ast

# ⚙️ Configuration
TARGET_EXTENSIONS = {
    '.py', '.java', '.js', '.ts', 
    '.html', '.sql', '.json', '.sh', '.yaml', '.yml'
}

# 분석에서 제외할 디렉토리 및 파일
IGNORE_DIRS = {
    '.git', '.idea', '.venv', 'venv', '.vscode', '__pycache__', 
    'node_modules', 'build', 'dist', '.gradle', 'coverage'
}
IGNORE_FILES = {
    'snapshot_pro_be.py', 'SNAPSHOT_PRO_BE.md', 'poetry.lock', 'package-lock.json'
}

OUTPUT_FILE = "SNAPSHOT_PRO_BE.md"

def get_file_content(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            return f.read()
    except:
        return ""

def get_docstring_summary(node):
    """AST 노드에서 Docstring의 첫 줄을 추출합니다."""
    docstring = ast.get_docstring(node)
    if docstring:
        return docstring.split('\n')[0].strip()
    return ""

def analyze_python_ast_deep(content):
    """
    Python 코드를 AST로 정밀 분석하여 FastAPI 구조(Route, Model)를 파악합니다.
    """
    details = []
    imports = set()
    
    try:
        tree = ast.parse(content)
        
        # 1. Import 분석 (기술 스택 파악)
        for node in tree.body:
            if isinstance(node, ast.Import):
                for alias in node.names:
                    imports.add(alias.name.split('.')[0])
            elif isinstance(node, ast.ImportFrom):
                if node.module:
                    imports.add(node.module.split('.')[0])

        # 주요 라이브러리 요약
        key_libs = [lib for lib in imports if lib in {'fastapi', 'pydantic', 'sqlalchemy', 'supabase', 'openai', 'numpy', 'pandas', 'celery'}]
        if key_libs:
            details.append(f"📚 **Tech Stack:** `{', '.join(key_libs)}`")

        # 2. 구조 분석
        for node in tree.body:
            # [Class] Pydantic Model or Service Class
            if isinstance(node, ast.ClassDef):
                bases = [b.id for b in node.bases if isinstance(b, ast.Name)]
                base_str = f"({', '.join(bases)})" if bases else ""
                
                # Pydantic 모델 감지
                icon = "📦" 
                if "BaseModel" in bases: icon = "fyp" # Schema
                
                doc = get_docstring_summary(node)
                desc = f" - *{doc}*" if doc else ""
                details.append(f"{icon} **Class:** `{node.name}{base_str}`{desc}")
                
                # 클래스 내부 메서드 요약 (너무 길어지지 않게 주요 메서드만)
                for sub in node.body:
                    if isinstance(sub, (ast.FunctionDef, ast.AsyncFunctionDef)):
                        if not sub.name.startswith("__"): # 매직 메서드 제외
                            details.append(f"  └─ 𝑓 `{sub.name}`")

            # [Function] API Route or Logic
            elif isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                is_async = "async " if isinstance(node, ast.AsyncFunctionDef) else ""
                
                # Decorator 확인 (FastAPI Route 감지)
                route_info = ""
                for dec in node.decorator_list:
                    if isinstance(dec, ast.Call) and isinstance(dec.func, ast.Attribute):
                        # @app.get, @router.post 등 감지
                        if dec.func.attr in {'get', 'post', 'put', 'delete', 'patch'}:
                            # 경로 추출
                            if dec.args and isinstance(dec.args[0], ast.Constant):
                                path = dec.args[0].value
                                route_info = f" [bw {dec.func.attr.upper()} {path}]"
                
                icon = "bw" if route_info else "𝑓"
                doc = get_docstring_summary(node)
                desc = f" - *{doc}*" if doc else ""
                
                details.append(f"{icon} **{is_async}def** `{node.name}`{route_info}{desc}")

            # [Variable] 전역 변수 (설정 등)
            elif isinstance(node, ast.Assign):
                for target in node.targets:
                    if isinstance(target, ast.Name) and target.id.isupper(): # 대문자 상수만
                        details.append(f"🔹 **Const:** `{target.id}`")

    except Exception as e:
        details.append(f"⚠️ Parsing Error: {str(e)}")
        
    return details

def analyze_file(filepath, content):
    _, ext = os.path.splitext(filepath)
    
    if ext == '.py':
        return analyze_python_ast_deep(content)
    
    # Python 외 파일 간단 분석
    details = []
    if ext in {'.js', '.ts'}:
        # JS/TS 함수 및 클래스 추출
        funcs = re.findall(r'(?:export\s+)?(?:async\s+)?function\s+([a-zA-Z0-9_]+)', content)
        classes = re.findall(r'class\s+([a-zA-Z0-9_]+)', content)
        if classes: details.append(f"📦 Classes: {', '.join(classes)}")
        if funcs: details.append(f"𝑓 Functions: {', '.join(funcs[:5])}...")
        
    return details

def write_snapshot():
    start_time = datetime.datetime.now()
    current_time_str = start_time.strftime("%Y-%m-%d %H:%M:%S")
    
    # 1. 문서 헤더 작성 (AI 프롬프트 포함)
    md_content = f"""# 🧠 Deep Context Snapshot (Backend)

**Generated at:** {current_time_str}
**Target:** AI Context Understanding & Code Preservation

> **🛑 INSTRUCTION FOR AI:**
> 1. This document contains the **entire backend source code**.
> 2. Look at the **Context Summary** above each file content first. It summarizes API routes, DB models, and core logic.
> 3. Use this context to identify relationships between `Schemas` (Pydantic), `Endpoints` (FastAPI), and `Services` (Business Logic).
> 4. Do not hallucinate files or functions not listed here.

---

## 🗺️ File Map
"""
    
    file_list = []
    total_files = 0
    
    # 2. 파일 탐색 및 트리 생성
    tree_str = "```text\n.\n"
    for root, dirs, files in os.walk('.'):
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
        
        level = root.replace('.', '').count(os.sep)
        indent = '│   ' * level
        subindent = '├── '
        
        if root != '.':
            tree_str += f"{indent}{os.path.basename(root)}/\n"
            
        for f in files:
            _, ext = os.path.splitext(f)
            if f in IGNORE_FILES: continue
            if ext in TARGET_EXTENSIONS:
                filepath = os.path.join(root, f)
                content = get_file_content(filepath)
                analysis = analyze_file(filepath, content)
                
                # 경로 정리
                clean_path = filepath.replace('.\\', '').replace('./', '')
                
                file_list.append((clean_path, content, analysis, ext))
                tree_str += f"{indent}│   {subindent}{f}\n"
                total_files += 1
    
    tree_str += "```"
    md_content += f"**Total Files:** {total_files}\n\n" + tree_str + "\n\n---\n\n## 💻 Source Details\n"

    # 3. 상세 내용 작성
    for path, content, analysis, ext in file_list:
        lang = ext.replace('.', '')
        
        # 분석 내용 포맷팅
        if analysis:
            analysis_text = "\n".join([f"* {item}" for item in analysis])
        else:
            analysis_text = "* (No structural elements detected)"

        md_content += f"""
        ### 📄 {path}
        > **Context Summary**
        {analysis_text}

        ```{lang}
        {content}"""
        

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(md_content)

    end_time = datetime.datetime.now()
    duration = (end_time - start_time).total_seconds()

    print(f"✅ Backend Snapshot created: {OUTPUT_FILE}")
    print(f"⏱️ Time taken: {duration:.2f}s")
    print(f"📂 Files processed: {total_files}")

if __name__ == "__main__":
    write_snapshot()