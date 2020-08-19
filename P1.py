from collections import namedtuple

scheme_chars = ('abcdefghijklmnopqrstuvwxyz'
                'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
                '0123456789'
                '+-.')

SplitResult = namedtuple(
    'SplitResult', 'scheme domain port path query fragment')

def _splitparams(url):
    if '/'  in url:
        i = url.find(';', url.rfind('/'))
        if i < 0:
            return url, ''
    else:
        i = url.find(';')
    return url[:i], url[i+1:]

def _splitnetloc(url, start=0):
    delim = len(url)   
    for c in '/?#':    
        wdelim = url.find(c, start)        
        if wdelim >= 0:                    
            delim = min(delim, wdelim)     
    return url[start:delim], url[delim:]

def _splitdomain(netloc):
    domain, garbage,port = netloc.partition(":")
    return domain, port

def split_url(url):
    netloc = query = fragment = ''
    i = url.find(':')
    if i > 0:
        if url[:i] == 'http':
            url = url[i+1:]
            if url[:2] == '//':
                netloc, url = _splitnetloc(url, 2)
                if (('[' in netloc and ']' not in netloc) or
                        (']' in netloc and '[' not in netloc)):
                    raise ValueError("Invalid IPv6 URL")
            if '#' in url:
                url, fragment = url.split('#', 1)
            if '?' in url:
                url, query = url.split('?', 1)
            domain,port = _splitdomain(netloc)
            v = SplitResult('http', domain, port, url, query, fragment)
            return v
        for c in url[:i]:
            if c not in scheme_chars:
                break
        else:
            rest = url[i+1:]
            if not rest or any(c not in '0123456789' for c in rest):
                scheme, url = url[:i].lower(), rest

    if url[:2] == '//':
        netloc, url = _splitnetloc(url, 2)
        if (('[' in netloc and ']' not in netloc) or
                (']' in netloc and '[' not in netloc)):
            raise ValueError("Invalid IPv6 URL")
    if '#' in url:
        url, fragment = url.split('#', 1)
    if '?' in url:
        url, query = url.split('?', 1)
    domain,port = _splitdomain(netloc)
    v = SplitResult(scheme, domain, port, url, query, fragment)
    return v
    
print(split_url("https://gist.github.com/gruber/249502"))