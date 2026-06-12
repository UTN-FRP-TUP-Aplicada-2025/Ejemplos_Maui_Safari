namespace Ejemplo_Maui_ReproBatch.Pages;

public partial class MainPage : ContentPage
{

    public bool enableRefreshing = false;
    public bool EnableRefreshing
    {
        get => enableRefreshing;
        set
        {
            enableRefreshing = value;
            OnPropertyChanged();
        }
    }

    public bool isRefreshing = false;
    public bool IsRefreshing
    {
        get => isRefreshing;
        set
        {
            isRefreshing = value;
            OnPropertyChanged();
        }
    }

    public MainPage()
    {
        InitializeComponent();
        EnableRefreshing = false;
        //webView.Source = "https://aplicada.somee.com/";
        webView.Source = "https://app.gobdigital.com.ar/homologacion/index?app=true&appVersion=1";
        //webView.Source = "https://aplicada.somee.com";
    }

    private void WebView_Navigating(object sender, WebNavigatingEventArgs e)
    {
       
    }

    private void WebView_Navigated(object sender, WebNavigatedEventArgs e)
    {
        IsRefreshing = false;
    }

    private void OnRefreshViewRefreshing(object sender, EventArgs e)
    {
        if (!EnableRefreshing)
        {
            IsRefreshing = false;
            return;
        }

        webView.Reload();
    }
}