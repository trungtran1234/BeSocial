#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main() {
    int diff, size = 9;
    char *buf1, *buf2;
    buf1 = (char *)malloc(size);
    buf2 = (char *)malloc(size);
    diff = buf2 - buf1;
    memset(buf2, '2', size);
    buf2[8] = '\0';
    printf("BEFORE: buf2 = %s\n", buf2);
    memset(buf1, '1', diff + 3);
    printf("AFTER: buf2 = %s\n", buf2);
    free(buf1);
    free(buf2);
    return 0;
}
