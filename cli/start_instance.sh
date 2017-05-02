#!/bin/bash

export EC2_HOME=/usr/local/bin/ec2-api-tools-1.7.5.1
export PATH=$PATH:$EC2_HOME/bin
export AWS_ACCESS_KEY=""
export AWS_SECRET_KEY=""
export JAVA_HOME=/usr/lib/jvm/jdk-8-oracle-arm32-vfp-hflt/jre

#Settings
instance=
allocation=
status_minecraft_server=$(ec2-describe-instance-status -A | grep $instance | awk '{ print $4 }')
telegram=/usr/local/bin/telegram_bot

status(){
    if [ $status_minecraft_server = "stopped" ]
    then
        start_instance
        echo "The Server is " $status_minecraft_server
    elif [ $status_minecraft_server = "running" ]
    then
        echo "The Server is " $status_minecraft_server
        echo "The Server already startdet, it is not necessary to boot"
        $telegram "$(hostname): The Server already startdet, it is not necessary to boot"
    fi
}

start_instance(){
    ec2-start-instances $instance
    $telegram "$(hostname): Starting EC2 Instance"
    sleep 50
    ec2-associate-address  --allocation-id $allocation -i $instance
}

status
