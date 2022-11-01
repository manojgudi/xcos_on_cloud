FROM ubuntu:18.04
ENV DEBIAN_FRONTEND=noninteractive
ENV UBUNTU_FRONTEND=noninteractive

ARG HOME=/root
ENV HOME=${HOME}

ARG SCILAB_DIR=${HOME}/scilab_for_xcos_on_cloud
ENV SCILAB_DIR=${SCILAB_DIR}

ARG XCOS_DIR=${HOME}/xcos_on_cloud
ENV XCOS_DIR=${XCOS_DIR}

ENV JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64

EXPOSE 8001

RUN \
    apt-get -y update && \
    apt-get -y upgrade && \
    apt-get -y install git curl unzip man wget telnet apt-utils

# Set timezone info
RUN apt-get update && \
    apt-get install -yq tzdata && \
    ln -fs /usr/share/zoneinfo/Asia/Kolkata /etc/localtime && \
    dpkg-reconfigure -f noninteractive tzdata

# Add sources
RUN echo "deb-src http://archive.ubuntu.com/ubuntu bionic restricted main multiverse universe" >> /etc/apt/sources.list
RUN echo "deb-src http://archive.ubuntu.com/ubuntu bionic-updates restricted main multiverse universe" >> /etc/apt/sources.list
RUN echo "deb-src http://archive.ubuntu.com/ubuntu bionic-backports main restricted universe multiverse" >> /etc/apt/sources.list
RUN echo "deb-src http://archive.ubuntu.com/ubuntu bionic-security restricted main multiverse universe" >> /etc/apt/sources.list
# Install pre-requisites
RUN \
    apt-get update && \
	apt-get -y build-dep scilab && \
	apt-get -y install libgfortran3 openjdk-8-jdk

#ADD /home/johnathon/.bashrc /root/.bashrc
WORKDIR ${HOME}

# Build scilab
RUN git clone --depth=1 https://github.com/FOSSEE/scilab_for_xcos_on_cloud
WORKDIR ${SCILAB_DIR}
RUN ./configure --disable-static-system-lib
RUN make -j 2

# Build XCos
RUN mkdir ${XCOS_DIR}
WORKDIR ${XCOS_DIR}
COPY . ./
RUN apt-get install -y python3-mysqldb python3-pip
RUN pip3 install -r requirements.txt

# Assume xos_on_cloud has already run make to build combined.js
#RUN make


CMD ["/usr/bin/python3", "/root/xcos_on_cloud/SendLog.py"]

