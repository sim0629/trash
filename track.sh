# File List Tracker

git init
git config user.name "track"
git config user.email "track@localhost"
git config advice.statusUoption false

while :
do
    git status -uall > status.log
    git add status.log
    git commit -m "status" -uno
    sleep 10
done
