package no.nav.dolly.web.config.filters;

import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import com.netflix.zuul.exception.ZuulException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;

@Slf4j
@RequiredArgsConstructor
public class AddAuthorizationToRouteFilter extends ZuulFilter {
    private final GenerateToken generateToken;
    private final String route;

    @Override
    public String filterType() {
        return "pre";
    }

    @Override
    public int filterOrder() {
        return 6;
    }

    @Override
    public boolean shouldFilter() {
        RequestContext ctx = RequestContext.getCurrentContext();
        return (ctx.get("proxy") != null) && ctx.get("proxy").equals(route);
    }

    @Override
    public Object run() throws ZuulException {
        try {
            RequestContext ctx = RequestContext.getCurrentContext();
            ctx.addZuulRequestHeader(HttpHeaders.AUTHORIZATION, "Bearer " + generateToken.getToken());
        } catch (Exception e) {
            log.error("Feil under filter request: {}", e.getMessage());
            throw new RuntimeException("Feil under filter request: ", e);
        }
        return null;
    }
}
