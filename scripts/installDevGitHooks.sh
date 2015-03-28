#!/bin/bash

CWD=$(/bin/pwd)

echo -e "Installing hook for repository $CWD/.git"
echo "#!/bin/sh
npm run lint && npm run test-all
" > $CWD/.git/hooks/pre-commit
chmod +x $CWD/.git/hooks/pre-commit
