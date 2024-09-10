#!/bin/bash
export TERM=ansi
export PS1="\e[0;32m[\h \W]\$ \e[m "
sed -i "s|/home/daytona:|$HOME:|g" /etc/passwd
mkdir -p "$HOME/.ssh"
chmod go-rwx "$HOME/.ssh"
daytona autocomplete bash
echo "source /etc/bash/bash_completion.sh" > $HOME/.bashrc
echo "source $HOME/.daytona.completion_script.bash" >> $HOME/.bashrc
echo "export TERM=$TERM" >> $HOME/.bashrsc
echo "export PS1=\"$PS1\"" >> $HOME/.bashrc
echo "/sbin/daytona.sh" >> $HOME/.bashrc
echo "cd $HOME" >> $HOME/.bashrc
echo "daytona whoami" >> $HOME/.bashrc
chown -R 1000:1000 "$HOME"
chown 1000 /var/run/docker.sock
sudo -u daytona -i daytona serve > /tmp/serve.out 2> /tmp/serve.log &
