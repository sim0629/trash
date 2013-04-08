#define w(e) && a[i e] == a[i] + 1 && q < g(i e)) q = g(i e);

a['  '], n, x, j, q, i, k;

g(i) {
    q = 0;
    if(i >= x w(-x)
    if(i + x < n w(+x)
    if(i % x w(-1)
    if(i % x < x - 1 w(+1)
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
