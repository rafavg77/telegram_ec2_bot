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
    if [ $status_minecraft_server = "running" ]
    then
        stop_instance
        echo "Stoping Minecraft Server"
    elif [ $status_minecraft_server = "stopped" ]
    then
        echo "The Server already Stoped, Nothing to do"
        $telegram "$(hostname): The Server already Stoped, Nothing to do"
    fi
}

stop_instance(){
    ec2-stop-instances i-0b538c5765d015376
    $telegram "$(hostname): Stoping Minecraft Server"

}

status
