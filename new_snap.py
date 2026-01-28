import os

# ==========================================
# ⚙️ 설정: 이사 갈 때 필요한 파일만 골라내는 필터
# ==========================================

# 1. 무시할 폴더 (내용이 너무 많거나 불필요한 것들)
IGNORE_DIRS = {
    'node_modules', '.git', '.next', 'dist', 'build', 'coverage', 
    '.vscode', '.idea', 'test', 'spec'
}

# 2. 무시할 파일 (보안상 위험하거나 용량 큰 것들)
IGNORE_FILES = {
    '.DS_Store', 'yarn.lock', 'package-lock.json', 'pnpm-lock.yaml',
    '.env', '.env.local', '.env.production', '.env.development' # 🚨 실제 환경변수 파일 제외
}

# 3. 가져올 파일 확장자 (소스코드 및 설정 파일)
TARGET_EXTS = {
    '.ts', '.tsx', '.js', '.jsx', '.json', '.css', '.scss', 
    '.sql', '.yaml', '.yml', '.md', '.html'
}

# 4. 확장자와 상관없이 무조건 가져올 중요 설정 파일들
CRITICAL_FILES = {
    'Dockerfile', 'docker-compose.yml', 'next.config.js', 
    'tsconfig.json', 'package.json', '.env.example', 'vercel.json'
}

def is_target_file(filename):
    """분석에 필요한 파일인지 검사합니다."""
    if filename in IGNORE_FILES:
        return False
    if filename in CRITICAL_FILES:
        return True
    return any(filename.endswith(ext) for ext in TARGET_EXTS)

def generate_tree(startpath):
    """폴더 구조를 트리 형태로 그립니다."""
    tree_str = "### 🌳 Project Structure\n```\n"
    for root, dirs, files in os.walk(startpath):
        # 무시할 폴더 제거
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
        
        level = root.replace(startpath, '').count(os.sep)
        indent = ' ' * 4 * (level)
        tree_str += f"{indent}{os.path.basename(root)}/\n"
        subindent = ' ' * 4 * (level + 1)
        for f in files:
            if is_target_file(f):
                tree_str += f"{subindent}{f}\n"
    tree_str += "```\n\n"
    return tree_str

def create_snapshot(root_dir, output_file):
    """스냅샷 파일을 생성합니다."""
    print(f"🚀 스냅샷 생성 시작: {root_dir}")
    
    with open(output_file, 'w', encoding='utf-8') as out:
        # 1. 헤더 작성
        out.write(f"# Project Snapshot\n")
        out.write(f"# Created for Migration to: Vercel + Render + Supabase\n\n")
        
        # 2. 폴더 구조 작성
        out.write(generate_tree(root_dir))
        
        out.write("### 📄 File Contents\n\n")

        # 3. 파일 내용 순회 및 작성
        file_count = 0
        for root, dirs, files in os.walk(root_dir):
            dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
            
            for file in files:
                if is_target_file(file):
                    file_path = os.path.join(root, file)
                    # 상대 경로로 표시
                    rel_path = os.path.relpath(file_path, root_dir)
                    
                    try:
                        with open(file_path, 'r', encoding='utf-8') as f:
                            content = f.read()
                            
                            # 파일 구분자 및 내용 작성
                            out.write(f"--- START OF FILE: {rel_path} ---\n")
                            # 파일 확장자에 따른 코드 블록 처리
                            ext = os.path.splitext(file)[1].lstrip('.')
                            if not ext: ext = 'text'
                            out.write(f"```{ext}\n")
                            out.write(content)
                            out.write(f"\n```\n")
                            out.write(f"--- END OF FILE: {rel_path} ---\n\n")
                            
                            file_count += 1
                            print(f"✅ Added: {rel_path}")
                    except Exception as e:
                        print(f"⚠️ Skipped (Read Error): {rel_path} - {e}")

    print(f"\n🎉 완료! '{output_file}' 파일이 생성되었습니다.")
    print(f"📊 총 {file_count}개의 파일이 포함되었습니다.")

if __name__ == "__main__":
    # 현재 폴더를 기준으로 스냅샷 생성
    current_dir = os.getcwd()
    output_filename = "migration_snapshot_fe.txt"
    create_snapshot(current_dir, output_filename)