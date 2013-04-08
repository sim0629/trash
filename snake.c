#define w(e) && a[i e] == a[i] + 1 && q < g(i e)) q = g(i e);
#define K if(i

a['  '], n, x, j, q, i, k;

g(i) {
    q = 0;
    K >= x w(-x)
    K + x < n w(+x)
    K % x w(-1)
    K % x < x - 1 w(+1)
    return q + 1;
}

main() {
    for(; ~scanf("%d", a + n); n++)
        for(; x * x < n; x++);

    for(; i < n; i++)
        j = g(i) > g(j) ? i : j;

    for(; k < g(j); k++)
        printf("%d ", a[j] + k);

    return 0;
}
