# ll

myfunc() {
    x=100
    y=20
    #sleep 4
    echo $(($x+$y))
    echo $1 | tr ' ' '\n'
    #sleep 5
}

myfunc "this is some string"