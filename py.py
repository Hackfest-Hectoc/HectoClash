with open('new', 'r') as file:
    count =0
    c=0
    while True:
        char = file.read(1)
        if(ord(char)>ord('0')) and (ord(char)<= ord('9')):
            print(char, end="")
            count +=1

        if(count%6 == 0 and c!= count):
            print(",", end="")
            c= count
    
    


