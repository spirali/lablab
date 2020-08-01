cd `dirname $0`

npm run build

rm -rf dist
cp -r build dist
