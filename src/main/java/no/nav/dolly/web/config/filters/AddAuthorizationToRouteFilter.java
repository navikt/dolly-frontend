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
            Object e = ctx.get("error.exception");
            if (e instanceof ZuulException) {
                ZuulException zuulException = (ZuulException) e;
                log.error("Zuul feilet med error: " + zuulException.getMessage(), zuulException);

                ctx.remove("error.status_code");

                ctx.setResponseBody("Overriding Zuul Exception Body");
                ctx.getResponse().setContentType("application/json");
                ctx.setResponseStatusCode(500);
            }
            ctx.addZuulRequestHeader(HttpHeaders.AUTHORIZATION, "Bearer " + generateToken.getToken());
        } catch (Exception ex) {
            log.error("Zuul feilet i AddAuthToRoute filter: ", ex);
            throw ex;
        }
        return null;
    }
}
