#define w(e) && a[e] == a[i] + 1) q = q > g(e) ? q : g(e);

a['  '], n, x, j, l, q, i;

g(i) {
    q = 0;
    if(i >= x w(i - x)
    if(i + x < n w(i + x)
    if(i % x w(i - 1)
    if(i % x < x - 1 w(i + 1)
    return q + 1;
}

main() {
    for(; ~scanf("%d", a + n); n++);
    for(; x * x < n; x++);

    for(i = 0; i < n; i++)
        j = g(i) > g(j) ? i : j;

    for(i = 0; i < g(j); i++)
        printf("%d ", a[j] + i);

    return 0;
}
