## Deploy to Github pages
```shell
rm -rf dist
rm -rf docs
yarn push
mv dist docs
```
Need to edit `docs/index.html` as [in this commit (delete the 7 leading `/`s following each href and src)](https://github.com/ConorSheehan1/spelling-bee/commit/33f233365ccb67b928169234be5842beab25d463)


Then in terminal
```terminal
git add .
git commit -n -m "message"
git pull
git push
```
to deploy.
