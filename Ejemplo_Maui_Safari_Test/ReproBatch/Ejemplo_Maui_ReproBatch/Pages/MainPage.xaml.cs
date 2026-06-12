namespace Ejemplo_Maui_ReproBatch.Pages;

public partial class MainPage : ContentPage
{
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

        //webView.Source = "https://aplicada.somee.com/";
        webView.Source = "https://aplicada.somee.com";
    }

    private void WebView_Navigating(object sender, WebNavigatingEventArgs e)
    {
        IsRefreshing = false;
    }

    private void WebView_Navigated(object sender, WebNavigatedEventArgs e)
    {
    }
}